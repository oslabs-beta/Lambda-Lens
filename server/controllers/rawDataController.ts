import { Request, Response, NextFunction } from 'express';
import {
  CloudWatchLogsClient,
  DescribeLogStreamsCommand,
  GetLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { getFunction } from './getFunctionsController';
import { FormattedLog } from '../types';
import { getAwsConfig } from '../configs/awsconfig';
import { AwsClientService } from '../services/AwsClientService';
import { MetricsValidator } from '../utils/validators';

interface LogEvent {
  message: string;
  timestamp: number;
}

class LogProcessor {
  private static readonly BATCH_SIZE = 6;

  private static formatLog(log: LogEvent, functionName: string): FormattedLog {
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
  }

  private static async fetchLogStream(client: CloudWatchLogsClient, functionName: string, stream: any) {
    const params = {
      logGroupName: `/aws/lambda/${functionName}`,
      logStreamName: stream.logStreamName,
      startFromHead: true,
    };

    try {
      const logsResponse = await client.send(new GetLogEventsCommand(params));
      return (logsResponse.events || [])
        .filter(event => event.message?.startsWith('REPORT'))
        .map(event => ({
          log: {
            message: event.message!,
            timestamp: event.timestamp || Date.now(),
          },
          functionName,
        }));
    } catch (err) {
      console.error(
        `Error retrieving log events for stream ${stream.logStreamName}: ${
          (err as Error).message
        }`
      );
      return [];
    }
  }

  public static async fetchAndFormatLogs(functionName: string): Promise<FormattedLog[]> {
    const formattedFunc = `/aws/lambda/${functionName}`;
    const allLogs: { log: LogEvent; functionName: string }[] = [];

    try {
      const awsClientService = AwsClientService.getInstance();
      const client = awsClientService.getClient<CloudWatchLogsClient>('CloudWatchLogsClient');
      
      const describeResponse = await client.send(
        new DescribeLogStreamsCommand({ 
          logGroupName: formattedFunc,
          orderBy: 'LastEventTime',
          descending: true,
          limit: this.BATCH_SIZE
        })
      );

      const streams = describeResponse.logStreams || [];
      const streamPromises = streams.map(stream => this.fetchLogStream(client, functionName, stream));
      const streamResults = await Promise.all(streamPromises);
      
      allLogs.push(...streamResults.flat());
      
      return allLogs.map(({ log, functionName }) => this.formatLog(log, functionName));
    } catch (err) {
      console.error(
        `Error processing logs for function ${functionName}: ${
          (err as Error).message
        }`
      );
      return [];
    }
  }
}

const lambdaController = {
  async processLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const functionNames = await getFunction();
      MetricsValidator.validateFunctionNames(functionNames);

      const logPromises = functionNames.map(async (functionName) => ({
        functionName,
        logs: await LogProcessor.fetchAndFormatLogs(functionName),
      }));

      const dataArr = await Promise.all(logPromises);
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
