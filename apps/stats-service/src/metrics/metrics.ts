import client from 'prom-client';

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const totalJobsSubmitted = new client.Gauge({
  name: 'total_jobs_submitted',
  help: 'Total number of jobs submitted',
});

export const totalJobsCompleted = new client.Gauge({
  name: 'total_jobs_completed',
  help: 'Total number of completed jobs',
});

export const queueLengthMetric = new client.Gauge({
  name: 'queue_length',
  help: 'Current queue length',
});

export const avgProcessingTime = new client.Gauge({
  name: 'avg_job_processing_time_seconds',
  help: 'Average job processing time',
});

register.registerMetric(totalJobsSubmitted);
register.registerMetric(totalJobsCompleted);
register.registerMetric(queueLengthMetric);
register.registerMetric(avgProcessingTime);
