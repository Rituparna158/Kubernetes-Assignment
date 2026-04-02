import { connection } from '../config/redis';
import { StatsResponse } from '../types/stats-types';

export const getStats = async (): Promise<StatsResponse> => {
  const keys = await connection.keys('job:*:status');

  let completed = 0;

  for (const key of keys) {
    const status = await connection.get(key);
    if (status === 'completed') completed++;
  }

  const queueLength = await connection.llen('job_queue');

  const avgTime = 0;

  return {
    total_jobs_submitted: keys.length,
    total_jobs_completed: completed,
    queue_length: queueLength,
    avg_processing_time: avgTime,
  };
};
