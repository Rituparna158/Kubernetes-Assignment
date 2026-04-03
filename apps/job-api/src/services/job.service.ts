import { connection } from '../config/redis';
import { Job } from '../types/job.types';

const QUEUE = 'job_queue';

export const addJobToQueue = async (job: Job) => {
  await connection.lpush(QUEUE, JSON.stringify(job));

  await connection.set(`job:${job.id}:status`, 'pending');

  const submitted = await connection.incr('stats:submitted');
};

export const getJobStatus = async (jobId: string) => {
  const status = await connection.get(`job:${jobId}:status`);
  return status;
};

export const getJobResult = async (jobId: string) => {
  const result = await connection.get(`job:${jobId}:result`);

  return result;
};
