import { Router } from 'express';
import { saveSecrets } from '../controllers/envController';

const router = Router();

router.post('/save', saveSecrets)

export default router