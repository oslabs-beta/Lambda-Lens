import { Router, Request, Response, NextFunction } from 'express';
import { databaseController } from '../controllers/databaseController';
import lambdaController from '../controllers/lambdaController';
// import lambdaController from '../controllers/rawDataController';

const dataRouter = Router();

dataRouter.get(
  '/update',
  lambdaController.processLogs,
  databaseController.processData,
  (req: Request, res: Response, next: NextFunction) => {
    console.log('data received');
    next();
  }
);

dataRouter.get(
  '/req',
  databaseController.getProccessedData,
  (req: Request, res: Response, next: NextFunction) => {
    // console.log('data requested', res.locals.data);
    return res.status(200).send(res.locals.data);
  }
);

export default dataRouter;
