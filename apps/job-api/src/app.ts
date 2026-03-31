import express from 'express';
import jobRoutes from './routes/job.routes';
import { register } from './metrics/metrics';

const app = express();

app.use(express.json());

app.use('/api', jobRoutes);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default app;
