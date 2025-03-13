import { LambdaClient, ListFunctionsCommand, ListFunctionsCommandOutput } from '@aws-sdk/client-lambda';
import { AwsClientService } from './AwsClientService';

export class AwsLambdaService {
  private static instance: AwsLambdaService;
  private readonly awsClientService: AwsClientService;

  private constructor() {
    this.awsClientService = AwsClientService.getInstance();
  }

  public static getInstance(): AwsLambdaService {
    if (!AwsLambdaService.instance) {
      AwsLambdaService.instance = new AwsLambdaService();
    }
    return AwsLambdaService.instance;
  }

  public async listFunctions(): Promise<string[]> {
    const lambdaClient = this.awsClientService.getClient<LambdaClient>('LambdaClient');
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
  }
}