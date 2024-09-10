import { Request, Response, NextFunction } from 'express';
import { CloudWatchClient, GetMetricDataCommand, GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';
import { getFunction } from './getFunctionsController';
import { awsconfig } from '../configs/awsconfig';

const client = new CloudWatchClient(awsconfig);

interface MetricData {
  [functionName: string]: {
    percentiles: Record<string, number[]>;
  };
}

// Define percentile we want
const percentiles = ['p90', 'p95', 'p99'];

// create unqiue id for each metric query
const generateValidId = (prefix: string, index: number, value: string) => {
  return `${prefix}_${index}_${value}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
};

// getting the metrics within the function names (func : related percentile)
const fetchMetrics = async (functionNames: string[]): Promise<GetMetricDataCommandOutput> => {
  const queries = functionNames.flatMap((functionName, index) => [
    ...percentiles.map((percentile) => ({
      Id: generateValidId('percentile', index, percentile),
      MetricStat: {
        Metric: {
          Namespace: 'AWS/Lambda',
          MetricName: 'Duration',
          Dimensions: [{ Name: 'FunctionName', Value: functionName }],
        },
        Period: 300, 
        Stat: percentile,
      },
      ReturnData: true,
    })),
  ]);

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 90 * 24 * 60 * 60 * 1000); 

  const command = new GetMetricDataCommand({
    MetricDataQueries: queries,
    StartTime: startTime,
    EndTime: endTime,
  });

  try {
    const data: GetMetricDataCommandOutput = await client.send(command);
    return data;
  } catch (error) {
    console.error('Error fetching metric data:', error);
    throw new Error('Error fetching metric data'); 
  }
};

// Averaging the values from array to get single values for each func
const average = (values: number[]): number => {
  const sum = values.reduce((acc, value) => acc + value, 0);
  return values.length > 0 ? sum / values.length : 0;
};

// process the metric responses from cloudwatch find and aggregate the percentile values
// store it in res.locals.metricData
const metricsController = {
  async processMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const functionNames = await getFunction();

      if (functionNames.length === 0) {
        return res.status(404).json({ error: 'No Lambda functions found' });
      }

      const metricData = await fetchMetrics(functionNames);

      // define MetricDataResults 
      const results = metricData.MetricDataResults ?? [];

      // Process and structure the metric data
      const processedData: MetricData = functionNames.reduce((acc, functionName, index) => {
        acc[functionName] = {
          percentiles: percentiles.reduce((percentileAcc, percentile) => {
            const percentileResults = results
              .filter(result => result.Id?.includes(generateValidId('percentile', index, percentile)))
              .flatMap(result => result.Values ?? []);

            // Aggregate the percentile values
            percentileAcc[percentile] = percentileResults.length > 0 ? [average(percentileResults)] : [0]; 
            return percentileAcc;
          }, {} as Record<string, number[]>),
        };
        return acc;
      }, {} as MetricData);

      res.locals.metricData = processedData; 
      return next();
    } catch (error) {
      next({
        log: 'Error in metricsController.processMetrics',
        status: 500,
        message: { err: 'Error occurred when fetching Lambda metrics' },
      });
    }
  },
};

export default metricsController;