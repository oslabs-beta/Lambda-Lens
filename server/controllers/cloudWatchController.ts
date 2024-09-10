import {
  CloudWatchClient,
  GetMetricDataCommand,
  GetMetricDataCommandOutput,
} from '@aws-sdk/client-cloudwatch';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { getFunction } from './getFunctionsController';
import { awsconfig } from '../configs/awsconfig';

const client = new CloudWatchClient(awsconfig);

const metricCommand = (funcName: string): GetMetricDataCommand => {
  // define time range for the metric data
  const endTime = new Date();
  // 90 day period
  const startTime = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  return new GetMetricDataCommand({
    MetricDataQueries: [
      // duration metric
      {
        Id: 'm1',
        MetricStat: {
          Metric: {
            Namespace: 'AWS/Lambda',
            MetricName: 'Duration',
            Dimensions: [
              {
                Name: 'FunctionName',
                Value: funcName,
              },
            ],
          },
          Period: 300,
          Stat: 'Average',
        },
        ReturnData: true,
      },
      // concurrent executions metric
      {
        Id: 'm2',
        MetricStat: {
          Metric: {
            Namespace: 'AWS/Lambda',
            MetricName: 'ConcurrentExecutions',
            Dimensions: [
              {
                Name: 'FunctionName',
                Value: funcName,
              },
            ],
          },
          Period: 300,
          Stat: 'Sum',
        },
        ReturnData: true,
      },
      // throttle metric
      {
        Id: 'm3',
        MetricStat: {
          Metric: {
            Namespace: 'AWS/Lambda',
            MetricName: 'Throttles',
            Dimensions: [
              {
                Name: 'FunctionName',
                Value: funcName,
              },
            ],
          },
          Period: 300,
          Stat: 'Sum',
        },
        ReturnData: true,
      },
    ],
    StartTime: startTime,
    EndTime: endTime,
  });
};

// fetch metric data
export const getMetricData = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // fetch existing AWS Lambda functions
    const functionNames = await getFunction();

    // create an array of commands to be sent to the CloudWatch Client
    const commandArr = functionNames.map((functionName) =>
      metricCommand(functionName)
    );

    // helper function that sends indivual commands to be sent to AWS Client
    const fetchData = async (
      command: GetMetricDataCommand
    ): Promise<GetMetricDataCommandOutput> => {
      return await client.send(command);
    };

    // resolves all promises into a data array
    const dataArr = await Promise.all(
      commandArr.map((command) => fetchData(command))
    );

    // map function names to metric reports (functionName array is in same order as dataArr)
    const mappedMetricsArray = functionNames.map((functionName, index) => {
      const metricData = dataArr[index];

      // if metric data results don't exist, then return an empty data set
      if (!metricData.MetricDataResults) {
        throw new Error(
          `Metric data for ${functionName} is missing or incomplete.`
        );
        return {
          functionName,
          duration: [],
          concurrentExecutions: [],
          throttles: [],
          timestamps: [],
        };
      }

      // if any Values do not exist, set variable to an empty array
      const duration = metricData.MetricDataResults[0].Values ?? [];
      const concurrent = metricData.MetricDataResults[1].Values ?? [];
      const throttles = metricData.MetricDataResults[2].Values ?? [];
      const timestamps = metricData.MetricDataResults[0].Timestamps ?? [];

      return {
        functionName: functionName,
        duration: duration,
        concurrentExecutions: concurrent,
        throttles: throttles,
        timestamps: timestamps,
      };
    });

    res.locals.cloudData = mappedMetricsArray;
    return next();
  } catch (error) {
    return next({
      log: 'Error in cloudWatchController.getMetricData',
      status: 500,
      message: { err: 'Error occured when retrieving Cloudwatch Metrics.' },
    });
  }
};