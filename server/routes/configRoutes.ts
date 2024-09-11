import { Router } from 'express';
import { envController } from '../controllers/envController';
import { Request, Response, NextFunction } from 'express';
import { connectDatabaseController } from '../controllers/connectDatabaseController';

const router = Router();

router.post('/save', envController.saveSecrets, (_req: Request, res: Response, next: NextFunction) => {
  // console.log('in the /api/config/save endpoint');
  return next();
});

router.get('/db', connectDatabaseController.connectDatabase, (_req: Request, res: Response, next: NextFunction) => {
  // console.log('in the /api/config/db endpoint');
  return next();
});

export default router