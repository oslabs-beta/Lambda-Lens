import { CloudWatchLogsClient, DescribeLogStreamsCommand, GetLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Log from '../models/lambdaModel'; 

// Load environment variables
dotenv.config();

// Define the logGroupName to fetch the logs from AWS
const logGroupName = '/aws/lambda/testfunc'; 

// Define the environment variables and access token in .env file
const region = process.env.AWS_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing one or more required environment variables');
}

// Provide the region and credentials to client
const client = new CloudWatchLogsClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
});

// Define log event and type
interface LogEvent {
  message: string;
  timestamp: number;
}

// Fetch and format the logs from CloudWatch and export it
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
              timestamp: event.timestamp || Date.now(),
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
        if (part === 'Billed') currentFormattedLog.BilledDuration = parts[index + 2];
        if (part === 'Init') currentFormattedLog.InitDuration = parts[index + 2];
        if (part === 'Max') currentFormattedLog.MaxMemUsed = parts[index + 3];
      });

      return currentFormattedLog;
    });

    console.log('Formatted Logs:', JSON.stringify(formattedLogs, null, 2));

    // Save formatted logs to MongoDB
    if (formattedLogs.length > 0) {
      await Log.insertMany(formattedLogs);
      console.log('Logs have been saved to MongoDB');
    }
  } catch (err) {
    console.error(`Error formatting logs: ${(err as Error).message}`);
  }
};

