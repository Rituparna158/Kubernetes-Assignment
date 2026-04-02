import express from 'express';
import { register } from './metrics/metrics';

const app = express();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default app;
