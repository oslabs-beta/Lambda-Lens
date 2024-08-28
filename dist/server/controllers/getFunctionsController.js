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
exports.getFunctions = void 0;
const client_lambda_1 = require("@aws-sdk/client-lambda");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
;
const config = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    region: process.env.AWS_REGION || '',
};
const lambdaClient = new client_lambda_1.LambdaClient(config);
// Function to list all Lambda functions
const getFunctions = () => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_lambda_1.ListFunctionsCommand({});
    try {
        const data = yield lambdaClient.send(command);
        const funcObjectArray = data.Functions || [];
        console.log(funcObjectArray);
        const functionsList = funcObjectArray.map(func => func.FunctionName || '');
        console.log(functionsList);
        return functionsList;
    }
    catch (err) {
        console.error(err);
        return [];
    }
});
exports.getFunctions = getFunctions;
