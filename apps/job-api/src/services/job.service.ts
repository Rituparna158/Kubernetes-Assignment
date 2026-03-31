import { connection} from '../config/redis';
import { Job } from '../types/job.types';

const QUEUE = "JobQueue";

export const addJobToQueue = async(job: Job) => {
    await connection.lpush(QUEUE, JSON.stringify(job));
};

export const getJobResult = async(jobId: string) => {
    return await connection.get(jobId);
};