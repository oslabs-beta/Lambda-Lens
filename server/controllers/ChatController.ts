import { Request, Response, NextFunction } from 'express';
import { BedrockRuntimeClient, InvokeModelCommand, BedrockRuntimeClientConfig } from '@aws-sdk/client-bedrock-runtime';
import ConversationModel from '../models/ConversationModel'; 
import { getAwsConfig } from '../configs/awsconfig';

interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
}



export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const awsconfig = getAwsConfig();
    
    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION,
      endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com',
      credentials: {
        accessKeyId: awsconfig.credentials.accessKeyId,
        secretAccessKey: awsconfig.credentials.secretAccessKey,
      },
    } as BedrockRuntimeClientConfig);

    const { message } = req.body;

    if (typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Invalid or empty message format' });
    }

    // console.log('Starting request handler');

    let conversationHistory: ConversationEntry[] = [];
    const conversationId = '2'; 

    let historyDoc;
    try {
      historyDoc = await ConversationModel.findOne({ id: conversationId }).exec();
    } catch (dbError) {
      return res.status(500).json({ error: `Database query failed: ${(dbError as Error).message}` });
    }

    if (historyDoc) {
      try {
        conversationHistory = historyDoc.conversation.map(({ role, content }: ConversationEntry) => ({
          role,
          content
        }));
        console.log('Conversation parsed:', conversationHistory);
      } catch (parseError) {
        return res.status(500).json({ error: `Failed to parse conversation history: ${(parseError as Error).message}` });
      }
      conversationHistory.push({ role: 'user', content: message });
    } else {
      console.log('No conversation found, creating new one');
      conversationHistory = [{ role: 'user', content: message }];
    }

    const input = {
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        messages: conversationHistory,
        max_tokens: 1000,
        anthropic_version: 'bedrock-2023-05-31',
      }),
    };

    const command = new InvokeModelCommand(input);
    let responseBody;
    try {
      const response = await client.send(command);

      if (response.body instanceof Uint8Array) {
        responseBody = new TextDecoder('utf-8').decode(response.body);
      } else if (typeof response.body === 'string') {
        responseBody = response.body;
      } else {
        responseBody = (response.body as any).toString();
      }

      const parsedResponse = JSON.parse(responseBody);
      console.log('Bedrock response:', parsedResponse);

      const contentArray = parsedResponse.content;
      if (Array.isArray(contentArray) && contentArray.length > 0) {
        const chatResponse = contentArray[0]?.text || 'No response';
        console.log('Chat Response:', chatResponse);

        const updatedConversation: ConversationEntry[] = [
          ...conversationHistory,
          { role: 'assistant', content: chatResponse },
        ];

        try {
          await ConversationModel.findOneAndUpdate(
            { id: conversationId },
            { conversation: updatedConversation, lastUpdated: new Date() },
            { new: true, upsert: true }
          ).exec();
          console.log('Conversation saved to database');
        } catch (dbError) {
          return res.status(500).json({ error: `Failed to save conversation to database: ${(dbError as Error).message}` });
        }

        return res.json({ result: chatResponse });
      } else {
        return res.status(500).json({ error: 'Invalid content structure in response' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to invoke Bedrock model', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};
