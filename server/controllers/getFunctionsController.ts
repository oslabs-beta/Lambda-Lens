import { LambdaClient, ListFunctionsCommand, ListFunctionsCommandOutput } from '@aws-sdk/client-lambda';
import { getAwsConfig } from '../configs/awsconfig';


export const getFunction = async (): Promise<string[]> => {
  const awsconfig = getAwsConfig();
  const command = new ListFunctionsCommand({});
  const lambdaClient = new LambdaClient(awsconfig);
  try {
    const data: ListFunctionsCommandOutput = await lambdaClient.send(command);
    const funcObjectArray = data.Functions || [];
    return funcObjectArray.map(func => func.FunctionName || '');
  } catch (err) {
    console.error('Error fetching Lambda functions:', err);
    return [];
  }
};