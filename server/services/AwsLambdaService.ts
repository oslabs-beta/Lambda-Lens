import { LambdaClient, ListFunctionsCommand, ListFunctionsCommandOutput } from '@aws-sdk/client-lambda';
import { configController } from '../controllers/ConfigController';

export class AwsLambdaService {
  private static instance: AwsLambdaService;

  private constructor() {}

  public static getInstance(): AwsLambdaService {
    if (!AwsLambdaService.instance) {
      AwsLambdaService.instance = new AwsLambdaService();
    }
    return AwsLambdaService.instance;
  }

  public async listFunctions(userId: string): Promise<string[]> {
    if (!userId) {
        throw new Error('User ID is required to list functions.');
    }

    const userConfig = await configController.getDecryptedUserConfig(userId);

    if (!userConfig) {
        console.warn(`No AWS configuration found for user ${userId}.`);
        throw new Error('AWS configuration not found for this user. Please save your configuration first.');
    }

    const lambdaClient = new LambdaClient({
        region: userConfig.awsRegion,
        credentials: {
            accessKeyId: userConfig.awsAccessKeyId,
            secretAccessKey: userConfig.awsSecretAccessKey,
        },
        maxAttempts: 3
    });

    const command = new ListFunctionsCommand({});

    try {
      const data: ListFunctionsCommandOutput = await lambdaClient.send(command);
      const funcObjectArray = data.Functions || [];
      const functionNames = funcObjectArray.map(func => func.FunctionName || '').filter(name => name !== '');

      return functionNames;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching Lambda functions');
      console.error(`Error fetching Lambda functions for user ${userId}:`, error);
      if (error.name === 'CredentialsProviderError' || (error.message && error.message.includes('InvalidClientTokenId'))) {
          throw new Error('Invalid AWS credentials provided.');
      }
      throw error;
    } finally {
    }
  }
}