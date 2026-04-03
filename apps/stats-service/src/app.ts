import express from 'express';
import statsRoutes from './routes/stats.routes';
import { register } from './metrics/metrics';

import { getStats } from './services/stats.service';
import {
  totalJobsSubmitted,
  totalJobsCompleted,
  queueLengthMetric,
  avgProcessingTime,
} from './metrics/metrics';

const app = express();

app.use('/api', statsRoutes);

app.get('/metrics', async (req, res) => {
  const stats = await getStats();

  totalJobsSubmitted.set(stats.total_jobs_submitted);
  totalJobsCompleted.set(stats.total_jobs_completed);
  queueLengthMetric.set(stats.queue_length);
  avgProcessingTime.set(stats.avg_processing_time);

  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default app;
