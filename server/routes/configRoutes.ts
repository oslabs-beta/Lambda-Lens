import { Router } from 'express';
import { configController } from '../controllers/ConfigController';

const router = Router();

router.post('/save', configController.saveConfiguration, (_req, res) => {
  res.status(200).json({ message: res.locals.saved });
});

router.get('/db', configController.connectDatabase, (_req, res) => {
  res.status(200).json({ message: 'Database connection established' });
});

export default router;