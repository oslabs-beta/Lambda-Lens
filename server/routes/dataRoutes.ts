import { Router, Request, Response, NextFunction } from 'express';
import { databaseController } from '../controllers/databaseController';
import metricsController from '../controllers/MetricsController';
import { lambdaController } from '../controllers/LambdaController'; 
import { verifyFirebaseToken } from '../middleware/authMiddleware';

const dataRouter = Router();

dataRouter.use(verifyFirebaseToken);

dataRouter.get(
  '/update',
  lambdaController.listFunctions, 
  metricsController.getProcessedLogs,
  databaseController.processData,
  (_req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json(res.locals.allData || { message: 'Data update processed.' });
    } catch (error) {
      next(error);
    }
  }
);

dataRouter.get(
  '/req',
  lambdaController.listFunctions, 
  metricsController.getProcessedLogs,
  databaseController.processData,
  databaseController.getProcessedData,
  (_req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json(res.locals.data);
    } catch (error) {
      next(error);
    }
  }
);

dataRouter.get(
  '/cloud',
  lambdaController.listFunctions, 
  metricsController.getCloudWatchMetrics,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.cloudData); 
  }
);

dataRouter.get(
  '/metrics',
  lambdaController.listFunctions, 
  metricsController.getPercentileMetrics,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.metricData);
  }
);

export default dataRouter;
