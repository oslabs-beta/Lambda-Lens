import { LambdaClient, ListFunctionsCommand, ListFunctionsCommandOutput } from '@aws-sdk/client-lambda';
import { awsconfig } from '../configs/awsconfig';
import { Config } from '../types';

const lambdaClient = new LambdaClient(awsconfig as Config);

export const getFunction = async (): Promise<string[]> => {
  const command = new ListFunctionsCommand({});
  try {
    const data: ListFunctionsCommandOutput = await lambdaClient.send(command);
    const funcObjectArray = data.Functions || [];
    return funcObjectArray.map(func => func.FunctionName || '');
  } catch (err) {
    console.error('Error fetching Lambda functions:', err);
    return [];
  }
};