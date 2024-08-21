import { CloudWatchLogsClient, DescribeLogStreamsCommand, GetLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
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
const client = new CloudWatchLogsClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
});

// define log event and type
interface LogEvent {
  message: string;
  timestamp: number;
}

// Fetch and format the logs from CloudWatch and export it
export const getLogs = async () => {
  // arrays to hold all the log events in logstream
  const allLogs: LogEvent[] = [];

  try {
    //Start fetching the log event --console to comment out--
    console.log(`Fetching log streams for log group: ${logGroupName}`);

    //Send request to Cloudwatch , access defined log group, then get log stream 
    const describeResponse = await client.send(new DescribeLogStreamsCommand({ logGroupName }));
    // get the list of log streams
    const streams = describeResponse.logStreams || [];

    // check number of log stream founds
    console.log(`Found ${streams.length} log streams`);

    // Process each log stream , limit to 6 streams
    for (const stream of streams.slice(-6)) {
      const params = {
        logGroupName,
        logStreamName: stream.logStreamName,
        startFromHead: true, // reading from beginning of log stream
      };

      try {
        //fetching from current stream
        console.log(`Fetching log events from stream: ${stream.logStreamName}`);
        // send request for current stream to get the log events
        const logsResponse = await client.send(new GetLogEventsCommand(params));
        // get the list of log events
        const events = logsResponse.events || [];

        console.log(`Found ${events.length} log events in stream ${stream.logStreamName}`);

        // Iterate to process each log event
        for (const event of events) {
          // filter the message startWith REPORT
          if (event.message && event.message.startsWith('REPORT')) {
            allLogs.push({
              message: event.message,
              timestamp: event.timestamp || 0,
              // Add other properties from logs as needed -- later on if needed --
            });
          }
        }
      } catch (err) {
        // catching issues when retrieving the log events from current log stream
        console.error(`Error retrieving log events for stream ${stream.logStreamName}: ${(err as Error).message}`);
      }
    }
  } catch (err) {
    // catching error when retrieving log stream
    console.error(`Error retrieving log streams: ${(err as Error).message}`);
  }

  try {
    // Format the collected logs
    const formattedLogs = allLogs.map((log) => {
      // convert timestamps
      const dateObject = new Date(log.timestamp);
      const formattedDate = dateObject.toLocaleString('en-US', { timeZone: 'UTC' }).split(', ');

      const currentFormattedLog: any = {
        Date: formattedDate[0],
        Time: formattedDate[1],
      };

      //Extract key values from the log message 
      /* Split the log message into individual words , store in part */
      const parts = log.message.split(/\s+/);
      
      /* Process each token (Duration, Billed, Init, Max) with its index 
      part: array of tokens obtained from log message
      index: current position where each token is being processed
      */
      parts.forEach((part, index) => {
        if (part === 'Duration:') {
          // an object where different properties of log entry are stored (ie. Duration)
          // access and match the keyword Duration in part
          // assuming next part is the duration value in parts[index + 1]
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

