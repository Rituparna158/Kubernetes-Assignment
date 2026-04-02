import { Request, Response } from 'express';
import { getStats } from '../services/stats.service';
import {
  totalJobsSubmitted,
  totalJobsCompleted,
  queueLengthMetric,
  avgProcessingTime,
} from '../metrics/metrics';

export const fetchStats = async (req: Request, res: Response) => {
  try {
    const stats = await getStats();

    totalJobsSubmitted.set(stats.total_jobs_submitted);
    totalJobsCompleted.set(stats.total_jobs_completed);
    queueLengthMetric.set(stats.queue_length);
    avgProcessingTime.set(stats.avg_processing_time);

    return res.json(stats);
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to fetch stats',
    });
  }
};
