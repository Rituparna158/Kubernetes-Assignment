import { Router } from 'express';
import { submitJob, getStatus } from '../controllers/job.controller';

const router = Router();

router.post('/submit', submitJob);
router.get('/status/:id', getStatus);

export default router;
