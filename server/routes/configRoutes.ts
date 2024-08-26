import { Router } from 'express';
import { envController } from '../controllers/envController';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/save', (req: Request, res: Response, next: NextFunction) => {
  console.log('Made it to the route');
  next();
}, envController.saveSecrets)

export default router