import { CloudWatchClient, GetMetricDataCommand, GetMetricDataCommandOutput } from '@aws-sdk/client-cloudwatch';
import { CloudWatchLogsClient, DescribeLogStreamsCommand, GetLogEventsCommand, LogStream } from '@aws-sdk/client-cloudwatch-logs'; // Import LogStream type
import { FormattedLog } from '../types/metrics';
import { configController } from '../controllers/ConfigController';
import { MetricsValidator } from '../utils/validators';

export interface MetricData {
  functionName: string;
  duration: number[];
  concurrentExecutions: number[];
  throttles: number[];
  timestamps: string[];
}

export interface PercentileData {
  [functionName: string]: {
    percentiles: Record<string, number[]>;
  };
}

export class MetricsProcessingService {
  private static instance: MetricsProcessingService;
  private readonly BATCH_SIZE = 6;
  private readonly TIME_WINDOW = 90 * 24 * 60 * 60 * 1000; 

  private constructor() {}

  public static getInstance(): MetricsProcessingService {
    if (!MetricsProcessingService.instance) {
      MetricsProcessingService.instance = new MetricsProcessingService();
    }
    return MetricsProcessingService.instance;
  }

  private async getCloudWatchClientForUser(userId: string): Promise<CloudWatchClient> {
     const userConfig = await configController.getDecryptedUserConfig(userId);
     if (!userConfig) {
       throw new Error(`AWS configuration not found for user ${userId}.`);
     }
     return new CloudWatchClient({
       region: userConfig.awsRegion,
       credentials: {
         accessKeyId: userConfig.awsAccessKeyId,
         secretAccessKey: userConfig.awsSecretAccessKey,
       },
       maxAttempts: 3
     });
  }

  private async getCloudWatchLogsClientForUser(userId: string): Promise<CloudWatchLogsClient> {
     const userConfig = await configController.getDecryptedUserConfig(userId);
     if (!userConfig) {
       throw new Error(`AWS configuration not found for user ${userId}.`);
     }
     return new CloudWatchLogsClient({
       region: userConfig.awsRegion,
       credentials: {
         accessKeyId: userConfig.awsAccessKeyId,
         secretAccessKey: userConfig.awsSecretAccessKey,
       },
       maxAttempts: 3 
     });
  }


  public async getCloudWatchMetrics(userId: string, functionNames: string[]): Promise<MetricData[]> {
    if (!userId) throw new Error('User ID is required for getCloudWatchMetrics.');
    MetricsValidator.validateFunctionNames(functionNames);

    const client = await this.getCloudWatchClientForUser(userId);

    const batches = this.batchArray(functionNames, this.BATCH_SIZE);
    const results = await Promise.all(
      batches.map(batch => this.processMetricsBatch(client, batch))
    );
    return results.flat();
  }

  public async getPercentileMetrics(userId: string, functionNames:string[]): Promise<PercentileData> {
    if (!userId) throw new Error('User ID is required for getPercentileMetrics.');
    MetricsValidator.validateFunctionNames(functionNames);

    const client = await this.getCloudWatchClientForUser(userId);

    const batches = this.batchArray(functionNames, this.BATCH_SIZE);
    const results = await Promise.all(
      batches.map(batch => this.processPercentilesBatch(client, batch))
    );
    return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }

  private async processMetricsBatch(client: CloudWatchClient, functionNames: string[]): Promise<MetricData[]> {
    const commands = functionNames.map(name => this.createMetricCommand(name));
    const responses = await Promise.all(
      commands.map(cmd => client.send(cmd))
    );

    return functionNames.map((name, idx) => this.normalizeMetricData(name, responses[idx]));
  }

  private async processPercentilesBatch(client: CloudWatchClient, functionNames: string[]): Promise<PercentileData> {
    const commands = functionNames.map(name => this.createPercentileCommand(name));
    const responses = await Promise.all(
      commands.map(cmd => client.send(cmd))
    );

    return functionNames.reduce((acc, name, idx) => ({
      ...acc,
      [name]: this.normalizePercentileData(responses[idx])
    }), {});
  }

  private createMetricCommand(functionName: string): GetMetricDataCommand {
    const endTime = new Date();
    const startTime = new Date(Date.now() - this.TIME_WINDOW);

    return new GetMetricDataCommand({
      MetricDataQueries: [
        this.createMetricQuery('m1', functionName, 'Duration', 'Average'),
        this.createMetricQuery('m2', functionName, 'ConcurrentExecutions', 'Sum'),
        this.createMetricQuery('m3', functionName, 'Throttles', 'Sum')
      ],
      StartTime: startTime,
      EndTime: endTime
    });
  }

  private createPercentileCommand(functionName: string): GetMetricDataCommand {
    const endTime = new Date();
    const startTime = new Date(Date.now() - this.TIME_WINDOW);
    const percentiles = ['p90', 'p95', 'p99'];

    return new GetMetricDataCommand({
      MetricDataQueries: percentiles.map((p, idx) => 
        this.createMetricQuery(`p${idx}`, functionName, 'Duration', p)
      ),
      StartTime: startTime,
      EndTime: endTime
    });
  }

  private createMetricQuery(id: string, functionName: string, metricName: string, stat: string) {
    return {
      Id: id,
      MetricStat: {
        Metric: {
          Namespace: 'AWS/Lambda',
          MetricName: metricName,
          Dimensions: [{ Name: 'FunctionName', Value: functionName }]
        },
        Period: 300,
        Stat: stat
      },
      ReturnData: true
    };
  }

  private normalizeMetricData(functionName: string, response: GetMetricDataCommandOutput): MetricData {
    const results = response.MetricDataResults || [];
    return {
      functionName,
      duration: results[0]?.Values || [],
      concurrentExecutions: results[1]?.Values || [],
      throttles: results[2]?.Values || [],
      timestamps: results[0]?.Timestamps?.map(t => t.toISOString()) || []
    };
  }

  private normalizePercentileData(response: GetMetricDataCommandOutput): { percentiles: Record<string, number[]> } {
    const results = response.MetricDataResults || [];
    const percentiles = ['p90', 'p95', 'p99'];
    
    return {
      percentiles: percentiles.reduce((acc, p, idx) => ({
        ...acc,
        [p]: results[idx]?.Values || []
      }), {})
    };
  }

  private batchArray<T>(array: T[], size: number): T[][] {
    return array.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(array.slice(i, i + size));
      return acc;
    }, [] as T[][]);
  }

  private formatLog(log: { message: string; timestamp: number }, functionName: string): FormattedLog {
    const dateObject = new Date(log.timestamp);
    const formattedDate = dateObject
      .toLocaleString('en-US', { timeZone: 'UTC' }) 
      .split(', ');

    const formattedLog: FormattedLog = {
      Date: formattedDate[0],
      Time: formattedDate[1],
      FunctionName: functionName,
      duration: '0',
      BilledDuration: '0',
      MaxMemUsed: '0'
    };

    const parts = log.message.split(/\s+/);
    parts.forEach((part, index) => {
      if (part === 'Duration:')
        formattedLog.duration = parts[index + 1];
      if (part === 'Billed')
        formattedLog.BilledDuration = parts[index + 2];
      if (part === 'Init')
        formattedLog.InitDuration = parts[index + 2];
      if (part === 'Max')
        formattedLog.MaxMemUsed = parts[index + 3];
    });

    return formattedLog;
  }

  private async fetchLogStream(client: CloudWatchLogsClient, functionName: string, stream: LogStream) {
    if (!stream.logStreamName) {
        console.warn(`Skipping stream for ${functionName} due to missing name.`);
        return [];
    }
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
          message: event.message!,
          timestamp: event.timestamp || Date.now(),
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

  private async fetchAndFormatLogs(userId: string, functionName: string): Promise<FormattedLog[]> {
    if (!userId) throw new Error('User ID is required for fetchAndFormatLogs.');

    const formattedFunc = `/aws/lambda/${functionName}`;
    const allLogs: { message: string; timestamp: number; functionName: string }[] = [];

    try {
      const client = await this.getCloudWatchLogsClientForUser(userId);

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

      return allLogs.map(log => this.formatLog(log, functionName));
    } catch (err) {
      console.error(
        `Error processing logs for function ${functionName} (User: ${userId}): ${
          (err as Error).message
        }`
      );
      if (err instanceof Error && err.name === 'ResourceNotFoundException') {
          console.warn(`Log group ${formattedFunc} not found for user ${userId}.`);
          return []; 
      }
      throw err; 
    }
  }

  public async getProcessedLogs(userId: string, functionNames: string[]): Promise<{ functionName: string; logs: FormattedLog[] }[]> {
    if (!userId) throw new Error('User ID is required for getProcessedLogs.');
    MetricsValidator.validateFunctionNames(functionNames);

    const logPromises = functionNames.map(async (functionName) => ({
      functionName,
      logs: await this.fetchAndFormatLogs(userId, functionName),
    }));

    return Promise.all(logPromises);
  }
}