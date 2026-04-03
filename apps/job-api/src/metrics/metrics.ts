import client from 'prom-client';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const jobSubmitted = new client.Counter({
  name: 'jobs_submitted_total',
  help: 'Totals jobs submitted',
  labelNames: ['type'],
});

register.registerMetric(jobSubmitted);
