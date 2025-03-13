import { Router, Request, Response } from 'express';
import { databaseController } from '../controllers/databaseController';
import metricsController from '../controllers/MetricsController';
import { handleChat } from '../controllers/ChatController';

const dataRouter = Router();

dataRouter.get(
  '/update',
  metricsController.getProcessedLogs,
  databaseController.processData,
  (_req: Request, res: Response) => {
    return res.status(200).send(res.locals.allData);
  }
);

dataRouter.get(
  '/req',
  metricsController.getProcessedLogs,
  databaseController.processData,
  databaseController.getProccessedData,
  (_req: Request, res: Response) => {
    return res.status(200).send(res.locals.data);
  }
);

dataRouter.get(
  '/cloud',
  metricsController.getCloudWatchMetrics,
  (_req: Request, res: Response) => {
    return res.status(200).send(res.locals.cloudData);
  }
);

dataRouter.get(
  '/metrics',
  metricsController.getPercentileMetrics,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.metricData);
  }
);

dataRouter.post('/chat', handleChat);

export default dataRouter;
