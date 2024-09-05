import { Request, Response, NextFunction } from 'express';
import {
  CloudWatchLogsClient,
  DescribeLogStreamsCommand,
  GetLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { getFunction } from './getFunctionsController';
import { FormattedLog } from '../types';
import { awsconfig } from '../configs/awsconfig';

const client = new CloudWatchLogsClient(awsconfig);

interface LogEvent {
  message: string;
  timestamp: number;
}

// formats report message string into useable key-value pairs
const formatLogs = (
  logs: { log: LogEvent; functionName: string }[]
): FormattedLog[] => {
  return logs.map(({ log, functionName }) => {
    const dateObject = new Date(log.timestamp);
    const formattedDate = dateObject
      .toLocaleString('en-US', { timeZone: 'UTC' })
      .split(', ');

    const currentFormattedLog: FormattedLog = {
      Date: formattedDate[0],
      Time: formattedDate[1],
      FunctionName: functionName,
    };

    const parts = log.message.split(/\s+/);

    parts.forEach((part, index) => {
      if (part === 'Billed')
        currentFormattedLog.BilledDuration = parts[index + 2];
      if (part === 'Init') currentFormattedLog.InitDuration = parts[index + 2];
      if (part === 'Max') currentFormattedLog.MaxMemUsed = parts[index + 3];
    });

    return currentFormattedLog;
  });
};

// fetches report data from aws
const fetchAndSaveLogs = async (functionName: string) => {
  const formattedFunc = `/aws/lambda/${functionName}`;
  const allLogs: { log: LogEvent; functionName: string }[] = [];

  try {
    const describeResponse = await client.send(
      new DescribeLogStreamsCommand({ logGroupName: formattedFunc })
    );
    const streams = describeResponse.logStreams || [];

    // takes the 6 most recent streams
    for (const stream of streams.slice(-6)) {
      const params = {
        logGroupName: formattedFunc,
        logStreamName: stream.logStreamName,
        startFromHead: true,
      };

      try {
        const logsResponse = await client.send(new GetLogEventsCommand(params));
        const events = logsResponse.events || [];

        // loops through all the events, finding messages that start with REPORT
        for (const event of events) {
          if (event.message && event.message.startsWith('REPORT')) {
            allLogs.push({
              log: {
                message: event.message,
                timestamp: event.timestamp || Date.now(),
              },
              functionName: functionName,
            });
          }
        }
      } catch (err) {
        console.error(
          `Error retrieving log events for stream ${stream.logStreamName}: ${
            (err as Error).message
          }`
        );
      }
    }
  } catch (err) {
    console.error(
      `Error retrieving log streams for log group ${functionName}: ${
        (err as Error).message
      }`
    );
  }
  return formatLogs(allLogs);
};

// processes the logs retrieved from the above functions and passes the data to the frontend
const lambdaController = {
  async processLogs(req: Request, res: Response, next: NextFunction) {
    try {
      // retrieves the array of function names
      const functionNames: string[] = await getFunction();

      if (functionNames.length === 0) {
        return res.status(404).json({ error: 'No Lambda functions found' });
      }

      // helper function that maps and fetches the log data to a schema
      const helper = async (functionNames: string[]) => {
        const fetchPromises = functionNames.map(async (functionName) => {
          return {
            functionName,
            logs: await fetchAndSaveLogs(functionName),
          };
        });

        // resolves all the promises
        const dataArr = await Promise.all(fetchPromises);

        return dataArr;
      };

      // invokes the helper function and stores the data in a new variable
      const dataArr = await helper(functionNames);

      res.locals.allData = dataArr;

      return next();
    } catch (err) {
      next({
        log: 'Error in lambdaController.processLogs',
        status: 500,
        message: { err: 'Error occurred when finding Lambda log streams' },
      });
    }
  },
};

export default lambdaController;
