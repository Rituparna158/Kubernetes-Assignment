import client from 'prom-client';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const jobProcessed = new client.Counter({
  name: 'jobs_processed_total',
  help: 'Total jobs processed',
  labelNames: ['type'],
});

export const jobErrors = new client.Counter({
  name: 'job_errors_total',
  help: 'Total failed jobs',
});

export const jobTime = new client.Histogram({
  name: 'job_processing_time_seconds',
  help: 'Job processing time',
  labelNames: ['type'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

register.registerMetric(jobProcessed);
register.registerMetric(jobErrors);
register.registerMetric(jobErrors);
