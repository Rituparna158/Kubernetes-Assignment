import { connection } from './config/redis';
import { jobProcessed, jobErrors, jobTime } from './metrics/metrics';
import { Job } from './types/job.types';

function calculatePrime(limit: number = 100000) {
  let count = 0;

  for (let i = 2; i < limit; i++) {
    let isPrime = true;

    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      count++;
    }
  }
  return count;
}

function sortArray(size: number = 100000) {
  const arr = Array.from({ length: size }, () =>
    Math.floor(Math.random() * size),
  );

  const sorted = arr.sort((a, b) => a - b);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    sample: sorted.slice(0, 5),
  };
}

function processJob(job: Job) {
  switch (job.type) {
    case 'prime':
      return calculatePrime(job.payload.limit ?? 100000);

    case 'array':
      return sortArray(job.payload.size ?? 100000);

    default:
      throw new Error(`Invalid job type: ${job.type}`);
  }
}

export async function startWorker(): Promise<void> {
  console.log('worker started...');

  while (true) {
    try {
      const data = await connection.brpop('job_queue', 0);

      if (!data) continue;

      const job: Job = JSON.parse(data[1]);

      console.log('Job received:', job);

      const end = jobTime.startTimer({ type: job.type });

      await connection.set(`job:${job.id}:status`, 'processing');

      const result = processJob(job);

      console.log('Job result:', result);

      await connection.set(`job:${job.id}:result`, JSON.stringify(result));
      await connection.set(`job:${job.id}:status`, 'completed');

      jobProcessed.inc({ type: job.type });

      end();
    } catch (err) {
      console.error('worker error:', err);
      jobErrors.inc();
    }
  }
}
