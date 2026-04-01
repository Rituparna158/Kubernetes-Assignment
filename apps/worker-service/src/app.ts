import express from 'express';
import { register } from './metrics/metrics';
import { registerHooks } from 'node:module';

const app = express();

app.get('/metrics', async (req, res) => {
  res.set('ContenteType', register.contentType);
  res.end(await register.metrics());
});

export default app;
