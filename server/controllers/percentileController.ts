// import { Request, Response, NextFunction } from 'express';
// import { CloudWatchClient, GetMetricDataCommand, GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';
// import { getFunction } from './getFunctionsController'; 
// import { awsconfig } from '../configs/awsconfig';

// const client = new CloudWatchClient(awsconfig);

// interface MetricData {
//   [functionName: string]: {
//     percentiles: Record<string, number[]>;
//     stats: Record<string, number[]>;
//   };
// }

// const percentiles = ['p25', 'p50', 'p75', 'p90', 'p95', 'p99', 'p99.9', 'p99.99'];
// const stats = ['Average', 'Minimum', 'Maximum'];

// const generateValidId = (prefix: string, index: number, value: string) => {
//   return `${prefix}_${index}_${value}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
// };

// const fetchMetrics = async (functionNames: string[]): Promise<GetMetricDataCommandOutput> => {
//   const queries = functionNames.flatMap((functionName, index) => [
//     ...percentiles.map((percentile) => ({
//       Id: generateValidId('percentile', index, percentile),
//       MetricStat: {
//         Metric: {
//           Namespace: 'AWS/Lambda',
//           MetricName: 'Duration',
//           Dimensions: [{ Name: 'FunctionName', Value: functionName }],
//         },
//         Period: 300,
//         Stat: percentile,
//       },
//       ReturnData: true,
//     })),
//     ...stats.map((stat) => ({
//       Id: generateValidId('stat', index, stat),
//       MetricStat: {
//         Metric: {
//           Namespace: 'AWS/Lambda',
//           MetricName: 'Duration',
//           Dimensions: [{ Name: 'FunctionName', Value: functionName }],
//         },
//         Period: 300,
//         Stat: stat,
//       },
//       ReturnData: true,
//     })),
//   ]);

//   console.log('Generated Queries:', JSON.stringify(queries, null, 2)); 

//   const endTime = new Date();
//   const startTime = new Date(endTime.getTime() - 90 * 24 * 60 * 60 * 1000); 

//   const command = new GetMetricDataCommand({
//     MetricDataQueries: queries,
//     StartTime: startTime,
//     EndTime: endTime,
//   });

//   try {
//     const data: GetMetricDataCommandOutput = await client.send(command);
//     return data;
//   } catch (error) {
//     console.error('Error fetching metric data:', error);
//     return {
//       MetricDataResults: [],
//       $metadata: {
//         httpStatusCode: 200,
//         requestId: '',
//         extendedRequestId: '',
//         cfId: '',
//         attempts: 1,
//         totalRetryDelay: 0,
//       },
//     };
//   }
// };

// const average = (values: number[]): number => {
//   const sum = values.reduce((acc, value) => acc + value, 0);
//   return sum / values.length;
// };

// const metricsController = {
//   async processMetrics(_req: Request, res: Response, next: NextFunction) {
//     try {
//       const functionNames = await getFunction();
//       console.log('Function Names:', functionNames); 

//       if (functionNames.length === 0) {
//         return res.status(404).json({ error: 'No Lambda functions found' });
//       }

//       const metricData = await fetchMetrics(functionNames);
//       const results = metricData.MetricDataResults ?? [];
//       console.log('Raw Metric Data Results:', JSON.stringify(results, null, 2)); 

//       const processedData: MetricData = functionNames.reduce((acc, functionName) => {
//         acc[functionName] = {
//           percentiles: percentiles.reduce((percentileAcc, percentile) => {
//             const percentileResults = results
//               .filter(result => result.Id && result.Id.includes(generateValidId('percentile', functionNames.indexOf(functionName), percentile)))
//               .flatMap(result => result.Values ?? []);

//             percentileAcc[percentile] = percentileResults.length > 0 ? [average(percentileResults)] : [0];
//             return percentileAcc;
//           }, {} as Record<string, number[]>),
//           stats: stats.reduce((statAcc, stat) => {
//             const statResults = results
//               .filter(result => result.Id && result.Id.includes(generateValidId('stat', functionNames.indexOf(functionName), stat)))
//               .flatMap(result => result.Values ?? []);
//             statAcc[stat] = statResults.length > 0 ? statResults : [0];
//             return statAcc;
//           }, {} as Record<string, number[]>),
//         };
//         return acc;
//       }, {} as MetricData);

//       console.log('Processed Metric Data:', JSON.stringify(processedData, null, 2)); 

//       res.locals.metricData = processedData; 
//       return next();
//     } catch (error) {
//       next({
//         log: 'Error in metricsController.processMetrics',
//         status: 500,
//         message: { err: 'Error occurred when fetching Lambda metrics' },
//       });
//     }
//   },
// };

// export default metricsController;

//--- with all % data----

// import { Request, Response, NextFunction } from 'express';
// import { CloudWatchClient, GetMetricDataCommand, GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';
// import { getFunction } from './getFunctionsController';
// import { awsconfig } from '../configs/awsconfig';

// const client = new CloudWatchClient(awsconfig);

// interface MetricData {
//   [functionName: string]: {
//     percentiles: Record<string, number[]>;
//     stats: Record<string, number[]>;
//   };
// }

// // Define metric percentiles and stats to fetch
// const percentiles = ['p25', 'p50', 'p75', 'p90', 'p95', 'p99', 'p99.9', 'p99.99'];
// const stats = ['Average', 'Minimum', 'Maximum'];

// // Generate valid Ids for metric queries
// const generateValidId = (prefix: string, index: number, value: string) => {
//   return `${prefix}_${index}_${value}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
// };

// // Fetch metrics for the given function names
// const fetchMetrics = async (functionNames: string[]): Promise<GetMetricDataCommandOutput> => {
//   const queries = functionNames.flatMap((functionName, index) => [
//     // Percentile metrics
//     ...percentiles.map((percentile) => ({
//       Id: generateValidId('percentile', index, percentile),
//       MetricStat: {
//         Metric: {
//           Namespace: 'AWS/Lambda',
//           MetricName: 'Duration',
//           Dimensions: [{ Name: 'FunctionName', Value: functionName }],
//         },
//         Period: 300, // 5 minutes
//         Stat: percentile,
//       },
//       ReturnData: true,
//     })),
//     // Min/Max/Average metrics
//     ...stats.map((stat) => ({
//       Id: generateValidId('stat', index, stat),
//       MetricStat: {
//         Metric: {
//           Namespace: 'AWS/Lambda',
//           MetricName: 'Duration',
//           Dimensions: [{ Name: 'FunctionName', Value: functionName }],
//         },
//         Period: 300, // 5 minutes
//         Stat: stat,
//       },
//       ReturnData: true,
//     })),
//   ]);

//   const endTime = new Date();
//   const startTime = new Date(endTime.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago

//   const command = new GetMetricDataCommand({
//     MetricDataQueries: queries,
//     StartTime: startTime,
//     EndTime: endTime,
//   });

//   try {
//     const data: GetMetricDataCommandOutput = await client.send(command);
//     return data;
//   } catch (error) {
//     console.error('Error fetching metric data:', error);
//     return {
//       MetricDataResults: [],
//       $metadata: {
//         httpStatusCode: 200,
//         requestId: '',
//         extendedRequestId: '',
//         cfId: '',
//         attempts: 1,
//         totalRetryDelay: 0,
//       },
//     };
//   }
// };

// // Calculate the average of an array of numbers
// const average = (values: number[]): number => {
//   const sum = values.reduce((acc, value) => acc + value, 0);
//   return values.length > 0 ? sum / values.length : 0;
// };

// const metricsController = {
//   async processMetrics(_req: Request, res: Response, next: NextFunction) {
//     try {
//       const functionNames = await getFunction();

//       if (functionNames.length === 0) {
//         return res.status(404).json({ error: 'No Lambda functions found' });
//       }

//       const metricData = await fetchMetrics(functionNames);

//       // Ensure MetricDataResults is defined
//       const results = metricData.MetricDataResults ?? [];

//       // Process and structure the metric data
//       const processedData: MetricData = functionNames.reduce((acc, functionName, index) => {
//         acc[functionName] = {
//           percentiles: percentiles.reduce((percentileAcc, percentile) => {
//             const percentileResults = results
//               .filter(result => result.Id?.includes(generateValidId('percentile', index, percentile)))
//               .flatMap(result => result.Values ?? []);

//             // Aggregate the percentile values
//             percentileAcc[percentile] = percentileResults.length > 0 ? [average(percentileResults)] : [0]; // Default value if no data
//             return percentileAcc;
//           }, {} as Record<string, number[]>),
//           stats: stats.reduce((statAcc, stat) => {
//             const statResults = results
//               .filter(result => result.Id?.includes(generateValidId('stat', index, stat)))
//               .flatMap(result => result.Values ?? []);
//             statAcc[stat] = statResults.length > 0 ? statResults : [0]; // Default value if no data
//             return statAcc;
//           }, {} as Record<string, number[]>),
//         };
//         return acc;
//       }, {} as MetricData);

//       res.locals.metricData = processedData; // Store the metric data in res.locals
//       return next();
//     } catch (error) {
//       next({
//         log: 'Error in metricsController.processMetrics',
//         status: 500,
//         message: { err: 'Error occurred when fetching Lambda metrics' },
//       });
//     }
//   },
// };

// export default metricsController;


// --- only 90 95 99 data --

// import { Request, Response, NextFunction } from 'express';
// import { CloudWatchClient, GetMetricDataCommand, GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';
// import { getFunction } from './getFunctionsController';
// import { awsconfig } from '../configs/awsconfig';

// const client = new CloudWatchClient(awsconfig);

// interface MetricData {
//   [functionName: string]: {
//     percentiles: Record<string, number[]>;
//   };
// }

// // Define metric percentiles to fetch (only p90, p95, p99)
// const percentiles = ['p90', 'p95', 'p99'];

// // Generate valid Ids for metric queries
// const generateValidId = (prefix: string, index: number, value: string) => {
//   return `${prefix}_${index}_${value}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
// };

// // Fetch metrics for the given function names
// const fetchMetrics = async (functionNames: string[]): Promise<GetMetricDataCommandOutput> => {
//   const queries = functionNames.flatMap((functionName, index) => [
//     // Percentile metrics
//     ...percentiles.map((percentile) => ({
//       Id: generateValidId('percentile', index, percentile),
//       MetricStat: {
//         Metric: {
//           Namespace: 'AWS/Lambda',
//           MetricName: 'Duration',
//           Dimensions: [{ Name: 'FunctionName', Value: functionName }],
//         },
//         Period: 300, // 5 minutes
//         Stat: percentile,
//       },
//       ReturnData: true,
//     })),
//   ]);

//   const endTime = new Date();
//   const startTime = new Date(endTime.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago

//   const command = new GetMetricDataCommand({
//     MetricDataQueries: queries,
//     StartTime: startTime,
//     EndTime: endTime,
//   });

//   try {
//     const data: GetMetricDataCommandOutput = await client.send(command);
//     return data;
//   } catch (error) {
//     console.error('Error fetching metric data:', error);
//     return {
//       MetricDataResults: [],
//       $metadata: {
//         httpStatusCode: 200,
//         requestId: '',
//         extendedRequestId: '',
//         cfId: '',
//         attempts: 1,
//         totalRetryDelay: 0,
//       },
//     };
//   }
// };

// // Calculate the average of an array of numbers
// const average = (values: number[]): number => {
//   const sum = values.reduce((acc, value) => acc + value, 0);
//   return values.length > 0 ? sum / values.length : 0;
// };

// const metricsController = {
//   async processMetrics(_req: Request, res: Response, next: NextFunction) {
//     try {
//       const functionNames = await getFunction();

//       if (functionNames.length === 0) {
//         return res.status(404).json({ error: 'No Lambda functions found' });
//       }

//       const metricData = await fetchMetrics(functionNames);

//       // Ensure MetricDataResults is defined
//       const results = metricData.MetricDataResults ?? [];

//       // Process and structure the metric data
//       const processedData: MetricData = functionNames.reduce((acc, functionName, index) => {
//         acc[functionName] = {
//           percentiles: percentiles.reduce((percentileAcc, percentile) => {
//             const percentileResults = results
//               .filter(result => result.Id?.includes(generateValidId('percentile', index, percentile)))
//               .flatMap(result => result.Values ?? []);

//             // Aggregate the percentile values
//             percentileAcc[percentile] = percentileResults.length > 0 ? [average(percentileResults)] : [0]; // Default value if no data
//             return percentileAcc;
//           }, {} as Record<string, number[]>),
//         };
//         return acc;
//       }, {} as MetricData);

//       res.locals.metricData = processedData; // Store the metric data in res.locals
//       return next();
//     } catch (error) {
//       next({
//         log: 'Error in metricsController.processMetrics',
//         status: 500,
//         message: { err: 'Error occurred when fetching Lambda metrics' },
//       });
//     }
//   },
// };

// export default metricsController;

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

// Define metric percentiles to fetch (only p90, p95, p99)
const percentiles = ['p90', 'p95', 'p99'];

// Generate valid Ids for metric queries
const generateValidId = (prefix: string, index: number, value: string) => {
  return `${prefix}_${index}_${value}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
};

// Fetch metrics for the given function names
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
        Period: 300, // 5 minutes
        Stat: percentile,
      },
      ReturnData: true,
    })),
  ]);

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago

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
    throw new Error('Error fetching metric data'); // Ensure errors are thrown
  }
};

// Calculate the average of an array of numbers
const average = (values: number[]): number => {
  const sum = values.reduce((acc, value) => acc + value, 0);
  return values.length > 0 ? sum / values.length : 0;
};

const metricsController = {
  async processMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const functionNames = await getFunction();

      if (functionNames.length === 0) {
        return res.status(404).json({ error: 'No Lambda functions found' });
      }

      const metricData = await fetchMetrics(functionNames);

      // Ensure MetricDataResults is defined
      const results = metricData.MetricDataResults ?? [];

      // Process and structure the metric data
      const processedData: MetricData = functionNames.reduce((acc, functionName, index) => {
        acc[functionName] = {
          percentiles: percentiles.reduce((percentileAcc, percentile) => {
            const percentileResults = results
              .filter(result => result.Id?.includes(generateValidId('percentile', index, percentile)))
              .flatMap(result => result.Values ?? []);

            // Aggregate the percentile values
            percentileAcc[percentile] = percentileResults.length > 0 ? [average(percentileResults)] : [0]; // Default value if no data
            return percentileAcc;
          }, {} as Record<string, number[]>),
        };
        return acc;
      }, {} as MetricData);

      res.locals.metricData = processedData; // Store the metric data in res.locals
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