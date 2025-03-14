import { Router, Request, Response, NextFunction } from 'express';
import { databaseController } from '../controllers/databaseController';

const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const isHealthy = await databaseController.checkHealth();
    return res.status(isHealthy ? 200 : 503).json({ 
      status: isHealthy ? 'healthy' : 'unhealthy' 
    });
  } catch (error) {
    next(error);
  }
});

export default healthRouter;