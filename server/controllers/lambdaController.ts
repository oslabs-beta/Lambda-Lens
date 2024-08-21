import { CloudWatchLogsClient, DescribeLogStreamsCommand, GetLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define the log group name here
const logGroupName = '/aws/lambda/testfunc'; 

// Ensure environment variables are defined
const region = process.env.AWS_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing one or more required environment variables');
}

// Initialize the CloudWatchLogsClient
const client = new CloudWatchLogsClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
});

interface LogEvent {
  message: string;
  timestamp: number;
}

export const getLogs = async () => {
  const allLogs: LogEvent[] = [];

  try {
    console.log(`Fetching log streams for log group: ${logGroupName}`);
    const describeResponse = await client.send(new DescribeLogStreamsCommand({ logGroupName }));
    const streams = describeResponse.logStreams || [];
    console.log(`Found ${streams.length} log streams`);

    for (const stream of streams.slice(-6)) {
      const params = {
        logGroupName,
        logStreamName: stream.logStreamName,
        startFromHead: true,
      };

      try {
        console.log(`Fetching log events from stream: ${stream.logStreamName}`);
        const logsResponse = await client.send(new GetLogEventsCommand(params));
        const events = logsResponse.events || [];
        console.log(`Found ${events.length} log events in stream ${stream.logStreamName}`);

        for (const event of events) {
          if (event.message && event.message.startsWith('REPORT')) {
            allLogs.push({
              message: event.message,
              timestamp: event.timestamp || 0,
              // Map other properties as needed
            });
          }
        }
      } catch (err) {
        console.error(`Error retrieving log events for stream ${stream.logStreamName}: ${(err as Error).message}`);
      }
    }
  } catch (err) {
    console.error(`Error retrieving log streams: ${(err as Error).message}`);
  }

  try {
    const formattedLogs = allLogs.map((log) => {
      const dateObject = new Date(log.timestamp);
      const formattedDate = dateObject.toLocaleString('en-US', { timeZone: 'UTC' }).split(', ');

      const currentFormattedLog: any = {
        Date: formattedDate[0],
        Time: formattedDate[1],
      };

      const parts = log.message.split(/\s+/);
      parts.forEach((part, index) => {
        if (part === 'Duration:') {
          currentFormattedLog.Duration = parts[index + 1];
        } else if (part === 'Billed') {
          currentFormattedLog.BilledDuration = parts[index + 2];
        } else if (part === 'Init') {
          currentFormattedLog.InitDuration = parts[index + 2];
        } else if (part === 'Max') {
          currentFormattedLog.MaxMemUsed = parts[index + 3];
        }
      });

      return currentFormattedLog;
    });

    console.log('Formatted Logs:', JSON.stringify(formattedLogs, null, 2));
  } catch (err) {
    console.error(`Error formatting logs: ${(err as Error).message}`);
  }
};

