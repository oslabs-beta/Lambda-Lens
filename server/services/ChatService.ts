import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import ConversationModel from '../models/chatConversation';
import { configController } from '../controllers/ConfigController';

class ChatServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

export class ChatService {
  private static instance: ChatService;
  private readonly conversationId = 'global_chat_v1';

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private async getBedrockClientForUser(userId: string): Promise<BedrockRuntimeClient> {
     const userConfig = await configController.getDecryptedUserConfig(userId);
     if (!userConfig) {
       throw new ChatServiceError(`AWS configuration not found for user ${userId}. Cannot initialize Bedrock client.`);
     }
     return new BedrockRuntimeClient({
       region: userConfig.awsRegion,
       credentials: {
         accessKeyId: userConfig.awsAccessKeyId,
         secretAccessKey: userConfig.awsSecretAccessKey,
       },
       maxAttempts: 3
     });
  }

  public async processMessage(userId: string, message: string): Promise<string> {
    if (!userId) {
        throw new ChatServiceError('User ID is required to process chat message.');
    }
    if (!message?.trim()) {
      throw new ChatServiceError('Invalid or empty message');
    }

    const conversationHistory = await this.getConversationHistory(message);
    const chatResponse = await this.invokeBedrock(userId, conversationHistory);
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

  private async invokeBedrock(userId: string, conversationHistory: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const client = await this.getBedrockClientForUser(userId);

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
       console.error(`Error invoking Bedrock for user ${userId}:`, error);
       if (error instanceof Error && error.name === 'AccessDeniedException') {
           throw new ChatServiceError(`AWS Bedrock access denied for user ${userId}. Check IAM permissions or region availability.`);
       }
       if (error instanceof Error && error.name === 'ResourceNotFoundException') {
           throw new ChatServiceError(`Bedrock model not found or not available in region for user ${userId}.`);
       }
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