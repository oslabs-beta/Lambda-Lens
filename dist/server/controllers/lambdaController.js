"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = void 0;
const client_cloudwatch_logs_1 = require("@aws-sdk/client-cloudwatch-logs");
const dotenv_1 = __importDefault(require("dotenv"));
const lambdaModel_1 = __importDefault(require("../models/lambdaModel"));
// Load environment variables
dotenv_1.default.config();
// Define the logGroupName to fetch the logs from AWS
// const logGroupName = '/aws/lambda/testfunc'; 
// Define the environment variables and access token in .env file
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing one or more required environment variables');
}
// Provide the region and credentials to client
const client = new client_cloudwatch_logs_1.CloudWatchLogsClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    }
});
const formatLogs = (logs) => {
    return logs.map((log) => {
        const dateObject = new Date(log.timestamp);
        const formattedDate = dateObject.toLocaleString('en-US', { timeZone: 'UTC' }).split(', ');
        const currentFormattedLog = {
            Date: formattedDate[0],
            Time: formattedDate[1],
        };
        const parts = log.message.split(/\s+/);
        parts.forEach((part, index) => {
            if (part === 'Billed')
                currentFormattedLog.BilledDuration = parts[index + 2];
            if (part === 'Init')
                currentFormattedLog.InitDuration = parts[index + 2];
            if (part === 'Max')
                currentFormattedLog.MaxMemUsed = parts[index + 3];
        });
        return currentFormattedLog;
    });
};
// Fetch and format the logs from CloudWatch and export it
const getLogs = (logGroupNames) => __awaiter(void 0, void 0, void 0, function* () {
    const allLogs = [];
    for (const logGroupName of logGroupNames) {
        try {
            console.log(`Fetching log streams for log group: ${logGroupName}`);
            const describeResponse = yield client.send(new client_cloudwatch_logs_1.DescribeLogStreamsCommand({ logGroupName }));
            const streams = describeResponse.logStreams || [];
            console.log(`Found ${streams.length} log streams for log group ${logGroupName}`);
            for (const stream of streams.slice(-6)) {
                const params = {
                    logGroupName,
                    logStreamName: stream.logStreamName,
                    startFromHead: true,
                };
                try {
                    console.log(`Fetching log events from stream: ${stream.logStreamName}`);
                    const logsResponse = yield client.send(new client_cloudwatch_logs_1.GetLogEventsCommand(params));
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
                }
                catch (err) {
                    console.error(`Error retrieving log events for stream ${stream.logStreamName}: ${err.message}`);
                }
            }
        }
        catch (err) {
            console.error(`Error retrieving log streams for log group ${logGroupName}: ${err.message}`);
        }
    }
    try {
        const formattedLogs = formatLogs(allLogs);
        console.log('Formatted Logs:', JSON.stringify(formattedLogs, null, 2));
        // Save formatted logs to MongoDB
        if (formattedLogs.length > 0) {
            yield lambdaModel_1.default.insertMany(formattedLogs);
            console.log('Logs have been saved to MongoDB');
        }
    }
    catch (err) {
        console.error(`Error formatting or saving logs: ${err.message}`);
    }
});
exports.getLogs = getLogs;
