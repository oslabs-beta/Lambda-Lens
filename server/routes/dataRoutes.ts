// import { Router, Request, Response, NextFunction } from 'express';
// import { databaseController } from '../controllers/databaseController';
// import lambdaController from '../controllers/lambdaController';
// // import lambdaController from '../controllers/rawDataController';

// const dataRouter = Router();

// dataRouter.get(
//   '/update',
//   lambdaController.processLogs,
//   databaseController.processData,
//   (_req: Request, res: Response, next: NextFunction) => {
//     console.log('data received');
//     return next();
//   }
// );

// dataRouter.get(
//   '/req',
//   lambdaController.processLogs,
//   databaseController.processData,
//   databaseController.getProccessedData,
//   (_req: Request, res: Response, _next: NextFunction) => {
//     // console.log('data requested', res.locals.data);
//     return res.status(200).send(res.locals.data);
//   }
// );

// export default dataRouter;


//---after---

import { Router, Request, Response, NextFunction } from 'express';
import { databaseController } from '../controllers/databaseController';
import lambdaController from '../controllers/lambdaController';
import { getMetricData } from '../controllers/cloudWatchController';
import metricsController from '../controllers/percentileController';

const dataRouter = Router();

dataRouter.get(
  '/update',
  lambdaController.processLogs,
  databaseController.processData,
  (_req: Request, res: Response, next: NextFunction) => {
    console.log('Data updated');
    return next();
  }
);

dataRouter.get(
  '/req',
  lambdaController.processLogs,
  databaseController.processData,
  databaseController.getProccessedData,
  (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(200).send(res.locals.data);
  }
);

dataRouter.get(
  '/cloud',
  getMetricData,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(res.locals.cloudData);
  }
);

dataRouter.get(
  '/metrics',
  metricsController.processMetrics, 
  (req: Request, res: Response, next: NextFunction) => {
    console.log('Metric data:', res.locals.metricData); // Debug log
    if (res.locals.metricData) {
      return res.status(200).json(res.locals.metricData);
    }
    return res.status(500).json({ error: 'No metric data available' });
  }
);

export default dataRouter;