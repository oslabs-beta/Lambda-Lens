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
exports.getMetricData = void 0;
const client_cloudwatch_1 = require("@aws-sdk/client-cloudwatch");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Define the logGroupName to fetch the logs from aws
const logGroupName = '/aws/lambda/testfunc';
// Define the environment variables and access token in .env file
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
//Check .env for all the variables
if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing one or more required environment variables');
}
// provide the region and credendials to client
const client = new client_cloudwatch_1.CloudWatchClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    }
});
// Define the time range for the metric data
const endTime = new Date();
const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
const command = new client_cloudwatch_1.GetMetricDataCommand({
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
                Period: 300, // 5 minutes
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
const getMetricData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield client.send(command);
        console.log('Metric Data:', JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.error('Error fetching metric data:', error);
    }
});
exports.getMetricData = getMetricData;
