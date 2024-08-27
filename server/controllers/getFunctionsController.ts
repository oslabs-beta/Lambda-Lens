import { LambdaClient, ListFunctionsCommand, ListFunctionsCommandOutput } from '@aws-sdk/client-lambda';
import dotenv from 'dotenv';
import path from 'path';
// import { Config } from '../../types.ts' 
import getLogs from './lambdaController'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env')});

//I still need to put this Config interface into a types.ts and import it, also need to not use ?
interface Config {
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
    region: string;
  };

const config: Config = {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    region: process.env.AWS_REGION || '',
};

const lambdaClient = new LambdaClient(config);

// Function to list all Lambda functions
export const getFunctions = async (): Promise<string[]> => {
    const command = new ListFunctionsCommand({});
    try {
        const data: ListFunctionsCommandOutput = await lambdaClient.send(command);
        const funcObjectArray = data.Functions || [];
        console.log(funcObjectArray);

        const functionsList: string[] = funcObjectArray.map(func => func.FunctionName || '');
        console.log(functionsList);

        return functionsList;
    } catch (err) {
        console.error(err);
        return [];
    }
};