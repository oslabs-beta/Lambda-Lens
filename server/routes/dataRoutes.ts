import { Router, Request, Response, NextFunction } from 'express';
import { databaseController } from '../controllers/DatabaseController';
import metricsController from '../controllers/MetricsController';

const dataRouter = Router();

dataRouter.get(
  '/update',
  metricsController.getProcessedLogs,
  databaseController.processData,
  (_req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json(res.locals.allData);
    } catch (error) {
      next(error);
    }
  }
);

dataRouter.get(
  '/req',
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

export default dataRouter;
