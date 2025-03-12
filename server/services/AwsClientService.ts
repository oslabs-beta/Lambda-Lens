import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { Config } from '../types';
import { getAwsConfig } from '../configs/awsconfig';

export class AwsClientService {
  private static instance: AwsClientService;
  private clients: Map<string, any>;
  private config: Config;

  private constructor() {
    this.clients = new Map();
    this.config = getAwsConfig();
  }

  public static getInstance(): AwsClientService {
    if (!AwsClientService.instance) {
      AwsClientService.instance = new AwsClientService();
    }
    return AwsClientService.instance;
  }

  private getClientConfig(clientType: string) {
    const baseConfig = {
      credentials: this.config.credentials,
      region: this.config.region,
      maxAttempts: 3
    };

    if (clientType === 'BedrockRuntimeClient') {
      return {
        ...baseConfig,
        endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com'
      };
    }

    return baseConfig;
  }

  public getClient<T>(clientType: string): T {
    if (!this.clients.has(clientType)) {
      const config = this.getClientConfig(clientType);
      let client;

      switch (clientType) {
        case 'CloudWatchClient':
          client = new CloudWatchClient(config);
          break;
        case 'LambdaClient':
          client = new LambdaClient(config);
          break;
        case 'CloudWatchLogsClient':
          client = new CloudWatchLogsClient(config);
          break;
        case 'BedrockRuntimeClient':
          client = new BedrockRuntimeClient(config);
          break;
        default:
          throw new Error(`Unsupported client type: ${clientType}`);
      }

      this.clients.set(clientType, client);
    }

    return this.clients.get(clientType) as T;
  }

  public updateConfig(newConfig: Config): void {
    this.config = newConfig;
    // Clear all existing clients so they'll be recreated with new config
    this.clients.clear();
  }

  public async shutdown(): Promise<void> {
    const shutdownPromises = Array.from(this.clients.values()).map(async (client) => {
      if (client && typeof client.destroy === 'function') {
        await client.destroy();
      }
    });

    await Promise.all(shutdownPromises);
    this.clients.clear();
  }
}