import { connection } from '../config/redis';
import { StatsResponse } from '../types/stats-types';

export const getStats = async (): Promise<StatsResponse> => {
  console.log(' Fetching stats...');

  const total = Number(await connection.get('stats:submitted')) || 0;
  const completed = Number(await connection.get('stats:completed')) || 0;
  const queueLength = await connection.llen('job_queue');

  const times = await connection.lrange('stats:processing_times', 0, -1);

  console.log(' Redis values:', {
    total,
    completed,
    queueLength,
    timesCount: times.length,
  });

  let avgTime = 0;

  if (times.length > 0) {
    const sum = times.reduce((acc, val) => acc + Number(val), 0);
    avgTime = sum / times.length / 1000;
  }

  return {
    total_jobs_submitted: total,
    total_jobs_completed: completed,
    queue_length: queueLength,
    avg_processing_time: avgTime,
  };
};
