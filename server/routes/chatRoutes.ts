import { Router } from 'express';
import chatController from '../controllers/ChatController';
import { verifyFirebaseToken } from '../middleware/authMiddleware'; 

const chatRouter = Router();

chatRouter.use(verifyFirebaseToken);

chatRouter.post('/', chatController.handleChat);

export default chatRouter;