import client from 'prom-client';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const jobSubmitted = new client.Counter({
  name: 'total_jobs_submitted',
  help: 'Totals jobs submitted',
});

register.registerMetric(jobSubmitted);
