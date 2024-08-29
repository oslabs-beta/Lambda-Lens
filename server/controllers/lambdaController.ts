import { Request, Response, NextFunction } from 'express';
import {
  CloudWatchLogsClient,
  DescribeLogStreamsCommand,
  GetLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { getFunction } from './getFunctionsController';
import Log from '../models/lambdaModel';
import { FormattedLog } from '../types';
import { awsconfig } from '../configs/awsconfig';

const client = new CloudWatchLogsClient(awsconfig);

interface LogEvent {
  message: string;
  timestamp: number;
}

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

const fetchAndSaveLogs = async (logGroupNames: string[]) => {
  const allLogs: { log: LogEvent; functionName: string }[] = [];

  for (const logGroupName of logGroupNames) {
    try {
      // console.log(`Fetching log streams for log group: ${logGroupName}`);
      const describeResponse = await client.send(
        new DescribeLogStreamsCommand({ logGroupName })
      );
      const streams = describeResponse.logStreams || [];

      // console.log(
      //   `Found ${streams.length} log streams for log group ${logGroupName}`
      // );

      for (const stream of streams.slice(-6)) {
        const params = {
          logGroupName,
          logStreamName: stream.logStreamName,
          startFromHead: true,
        };

        try {
          // console.log(
          //   `Fetching log events from stream: ${stream.logStreamName}`
          // );
          const logsResponse = await client.send(
            new GetLogEventsCommand(params)
          );
          const events = logsResponse.events || [];

          // console.log(
          //   `Found ${events.length} log events in stream ${stream.logStreamName}`
          // );

          for (const event of events) {
            if (event.message && event.message.startsWith('REPORT')) {
              allLogs.push({
                log: {
                  message: event.message,
                  timestamp: event.timestamp || Date.now(),
                },
                functionName: logGroupName,
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
        `Error retrieving log streams for log group ${logGroupName}: ${
          (err as Error).message
        }`
      );
    }
  }

  try {
    const formattedLogs = formatLogs(allLogs);
    // console.log(formattedLogs);

    // iterate each array to sort into specific function pools
    // then for each function pool, findOneAndUpdate
    // possible identifiers: function name, date and time

    for (const unsortedLogs of formattedLogs) {
      console.log('unsortedLogs:', unsortedLogs);
      await Log.findOneAndUpdate(
        {
          FunctionName: unsortedLogs.FunctionName,
          Date: unsortedLogs.Date,
          Time: unsortedLogs.Time,
        },
        unsortedLogs,
        {
          upsert: true,
          returnNewDocument: true,
        }
      );
    }

    // console.log('Formatted Logs:', JSON.stringify(formattedLogs, null, 2));

    // if (formattedLogs.length > 0) {
    //   await Log.insertMany(formattedLogs);
    //   // console.log('Logs have been saved to MongoDB');
    // }
  } catch (err) {
    console.error(`Error formatting or saving logs: ${(err as Error).message}`);
  }
};

const lambdaController = {
  async processLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      const functionNames = await getFunction();

      if (functionNames.length === 0) {
        return res.status(404).json({ error: 'No Lambda functions found' });
      }

      const logGroupNames = functionNames.map((name) => `/aws/lambda/${name}`);

      await fetchAndSaveLogs(logGroupNames);

      const allData: { functionName: string; logs: FormattedLog[] }[] = [];

      for (const logGroupName of logGroupNames) {
        const functionName = logGroupName.replace('/aws/lambda/', '');

        const logs = await Log.find({ FunctionName: logGroupName });

        const formattedLogs: FormattedLog[] = logs.map((log) => ({
          Date: log.Date || '',
          Time: log.Time || '',
          BilledDuration: log.BilledDuration || '',
          MaxMemUsed: log.MaxMemUsed || '',
          InitDuration: log.InitDuration || '',
        }));

        allData.push({
          functionName,
          logs: formattedLogs,
        });
      }

      res.locals.allData = allData;

      return next();
    } catch (err) {
      next({
        log: 'Error in lambdaController.processLogs', 
        status: 500, 
        message: { err: 'Error occured when finding Lambda log streams'} });
    }
  },
};

export default lambdaController;
