import { Router, Request, Response, NextFunction } from 'express';
import { databaseController } from '../controllers/databaseController';
import lambdaController from '../controllers/rawDataController';
import { handleChat } from '../controllers/ChatController';
import metricsController from '../controllers/MetricsController';

const dataRouter = Router();

dataRouter.get(
  '/update',
  lambdaController.processLogs,
  databaseController.processData,
  (_req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.allData);
  }
);

dataRouter.get(
  '/req',
  lambdaController.processLogs,
  databaseController.processData,
  databaseController.getProccessedData,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.data);
  }
);

dataRouter.get(
  '/cloud',
  metricsController.getCloudWatchMetrics,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.cloudData);
  }
);

dataRouter.get(
  '/metrics',
  metricsController.getPercentileMetrics,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(res.locals.metricData);
  }
);

dataRouter.post('/chat', handleChat);

export default dataRouter;
