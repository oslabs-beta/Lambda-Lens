import { LambdaClient, ListFunctionsCommand, ListFunctionsCommandOutput } from '@aws-sdk/client-lambda';
import { AwsClientService } from '../services/AwsClientService';

export const getFunction = async (): Promise<string[]> => {
  const awsClientService = AwsClientService.getInstance();
  const lambdaClient = awsClientService.getClient<LambdaClient>('LambdaClient');
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