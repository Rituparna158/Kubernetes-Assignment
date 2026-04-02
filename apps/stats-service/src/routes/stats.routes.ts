import { Router } from 'express';
import { fetchStats } from '../controllers/stats.controller';

const router = Router();

router.get('/stats', fetchStats);

export default router;
