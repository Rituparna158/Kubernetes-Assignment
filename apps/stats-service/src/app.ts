import express from 'express';
import statsRoutes from './routes/stats.routes';
import { register } from './metrics/metrics';

const app = express();

app.use('/api', statsRoutes);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default app;
