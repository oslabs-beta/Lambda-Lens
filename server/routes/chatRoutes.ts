import { Router } from 'express';
import chatController from '../controllers/ChatController';

const chatRouter = Router();
chatRouter.post('/', chatController.handleChat);

export default chatRouter;