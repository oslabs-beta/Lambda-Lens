import { CloudWatchClient, GetMetricDataCommand, GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define the logGroupName to fetch the logs from aws
const logGroupName = '/aws/lambda/testfunc'; 

// Define the environment variables and access token in .env file
const region = process.env.AWS_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;

//Check .env for all the variables
if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing one or more required environment variables');
}

// provide the region and credendials to client
const client = new CloudWatchClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
});

// Define the time range for the metric data
const endTime = new Date();
const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); 

const command = new GetMetricDataCommand({
  MetricDataQueries: [
    {
      Id: 'm1',
      MetricStat: {
        Metric: {
          Namespace: 'AWS/Lambda',
          MetricName: 'Duration',
          Dimensions: [
            {
              Name: 'FunctionName',
              Value: 'testfunc'
            },
          ]
        },
        Period: 300, 
        Stat: 'Average',
      },
      ReturnData: true,
    },
    // Throttle metric
    {
      Id: 'm2',
      MetricStat: {
        Metric: {
          Namespace: 'AWS/Lambda',
          MetricName: 'ConcurrentExecutions',
          Dimensions: [
            {
              Name: 'FunctionName',
              Value: 'testfunc'
            },
          ]
        },
        Period: 300,  // 5 minutes
        Stat: 'Sum',
      },
      ReturnData: true,
    },
    // Error rate metric
    {
      Id: 'm3',
      MetricStat: {
        Metric: {
          Namespace: 'AWS/Lambda',
          MetricName: 'Throttles',
          Dimensions: [
            {
              Name: 'FunctionName',
              Value: 'testfunc'
            },
          ]
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

// Fetch the metric data
export const getMetricData = async (): Promise<void> => {
    try {
      const data: GetMetricDataCommandOutput = await client.send(command);
      console.log('Metric Data:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error fetching metric data:', error);
    }
  };