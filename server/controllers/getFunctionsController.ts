import { LambdaClient, ListFunctionsCommand, ListFunctionsCommandOutput } from '@aws-sdk/client-lambda';
import { AwsClientService } from '../services/AwsClientService';

export const getFunction = async (): Promise<string[]> => {
  const awsClientService = AwsClientService.getInstance();
  const lambdaClient = awsClientService.getClient<LambdaClient>('LambdaClient');
  const command = new ListFunctionsCommand({});
  
  try {
    const data: ListFunctionsCommandOutput = await lambdaClient.send(command);
    const funcObjectArray = data.Functions || [];
    const functionNames = funcObjectArray.map(func => func.FunctionName || '').filter(name => name !== '');
    
    if (functionNames.length === 0) {
      throw new Error('No Lambda functions found in the configured AWS region');
    }
    
    return functionNames;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error fetching Lambda functions');
    console.error('Error fetching Lambda functions:', error);
    throw error;
  }
};