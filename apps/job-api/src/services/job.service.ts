import { connection } from '../config/redis';
import { Job } from '../types/job.types';

const QUEUE = 'job_queue';

export const addJobToQueue = async (job: Job) => {
  await connection.lpush(QUEUE, JSON.stringify(job)); //push job to redis

  await connection.set(`job:${job.id}:status`, 'pending'); //initialize job status
};

export const getJobStatus = async (jobId: string) => {
  return await connection.get(`job:${jobId}:status`); // fetch job status from redis
};

export const getJobResult = async (jobId: string) => {
  return await connection.get(`job:${jobId}:result`); //fetch job result from redis
};
