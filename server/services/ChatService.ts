import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import ConversationModel from '../models/ConversationModel';
import { AwsClientService } from './AwsClientService';

class ChatServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

export class ChatService {
  private static instance: ChatService;
  private readonly awsClientService: AwsClientService;
  private readonly conversationId = '2'; // TODO: Make this configurable

  private constructor() {
    this.awsClientService = AwsClientService.getInstance();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public async processMessage(message: string): Promise<string> {
    if (!message?.trim()) {
      throw new ChatServiceError('Invalid or empty message');
    }

    const conversationHistory = await this.getConversationHistory(message);
    const chatResponse = await this.invokeBedrock(conversationHistory);
    await this.saveConversation([...conversationHistory, { role: 'assistant', content: chatResponse }]);
    
    return chatResponse;
  }

  private async getConversationHistory(newMessage: string): Promise<Array<{ role: string; content: string }>> {
    try {
      const historyDoc = await ConversationModel.findOne({ id: this.conversationId }).exec();
      if (historyDoc) {
        const history = historyDoc.conversation.map(({ role, content }) => ({
          role,
          content
        }));
        return [...history, { role: 'user', content: newMessage }];
      }
      return [{ role: 'user', content: newMessage }];
    } catch (error) {
      throw new ChatServiceError(`Failed to fetch conversation history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async invokeBedrock(conversationHistory: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const client = this.awsClientService.getClient<BedrockRuntimeClient>('BedrockRuntimeClient');
      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          messages: conversationHistory,
          max_tokens: 1000,
          anthropic_version: 'bedrock-2023-05-31',
        }),
      });

      const response = await client.send(command);
      const responseBody = this.parseBedrockResponse(response.body);
      const parsedResponse = JSON.parse(responseBody);
      
      if (!Array.isArray(parsedResponse.content) || !parsedResponse.content.length) {
        throw new ChatServiceError('Invalid content structure in response');
      }

      return parsedResponse.content[0]?.text || 'No response';
    } catch (error) {
      throw new ChatServiceError(`Failed to invoke Bedrock model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseBedrockResponse(body: any): string {
    if (body instanceof Uint8Array) {
      return new TextDecoder('utf-8').decode(body);
    }
    if (typeof body === 'string') {
      return body;
    }
    return body.toString();
  }

  private async saveConversation(conversation: Array<{ role: string; content: string }>): Promise<void> {
    try {
      await ConversationModel.findOneAndUpdate(
        { id: this.conversationId },
        { conversation, lastUpdated: new Date() },
        { new: true, upsert: true }
      ).exec();
    } catch (error) {
      throw new ChatServiceError(`Failed to save conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}