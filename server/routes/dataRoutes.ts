import { Router, Request, Response, NextFunction } from 'express';
import { databaseController } from '../controllers/databaseController';
import { getMetricData } from '../controllers/cloudwatchController';
import lambdaController from '../controllers/lambdaController';
// import lambdaController from '../controllers/rawDataController';

const dataRouter = Router();

dataRouter.get(
  '/update',
  lambdaController.processLogs,
  databaseController.processData,
  (_req: Request, res: Response, next: NextFunction) => {
    console.log('data received');
    return next();
  }
);

dataRouter.get(
  '/req',
  lambdaController.processLogs,
  databaseController.processData,
  databaseController.getProccessedData,
  (req: Request, res: Response, next: NextFunction) => {
    // console.log('data requested from AWS Lambda:', res.locals.data);
    return res.status(200).send(res.locals.data);
  }
);

dataRouter.get(
  '/cloud',
  getMetricData,
  (req: Request, res: Response, next: NextFunction) => {
    // console.log('data requested from Cloud Watch:', res.locals.data);
    return res.status(200).send(res.locals.cloudData);
  }
);

export default dataRouter;
