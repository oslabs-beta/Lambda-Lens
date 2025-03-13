import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/ChatService';

class ChatController {
  private static instance: ChatController;
  private chatService: ChatService;

  private constructor() {
    this.chatService = ChatService.getInstance();
  }

  public static getInstance(): ChatController {
    if (!ChatController.instance) {
      ChatController.instance = new ChatController();
    }
    return ChatController.instance;
  }

  public handleChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { message } = req.body;

      if (typeof message !== 'string' || message.trim() === '') {
        return next({
          log: 'Error in ChatController.handleChat: Invalid message format',
          status: 400,
          message: { err: 'Invalid or empty message format' }
        });
      }

      const chatResponse = await this.chatService.processMessage(message);
      res.json({ result: chatResponse });
    } catch (error) {
      next({
        log: `Error in ChatController.handleChat: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 500,
        message: { err: 'An error occurred during chat processing.' }
      });
    }
  };
}

const chatController = ChatController.getInstance();
export default chatController;
