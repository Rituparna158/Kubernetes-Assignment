import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchStats } from '../src/controllers/stats.controller';
import * as statsService from '../src/services/stats.service';
import {
  totalJobsSubmitted,
  totalJobsCompleted,
  queueLengthMetric,
  avgProcessingTime,
} from '../src/metrics/metrics';
import { Request, Response } from 'express';

vi.mock('../src/services/stats.service', () => ({
  getStats: vi.fn(),
}));

vi.mock('../src/metrics/metrics', () => ({
  totalJobsSubmitted: { set: vi.fn() },
  totalJobsCompleted: { set: vi.fn() },
  queueLengthMetric: { set: vi.fn() },
  avgProcessingTime: { set: vi.fn() },
}));

const createRes = (): Response => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('Stats Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return stats successfully', async () => {
    const mockStats = {
      total_jobs_submitted: 10,
      total_jobs_completed: 5,
      queue_length: 2,
      avg_processing_time: 1.2,
    };

    vi.mocked(statsService.getStats).mockResolvedValue(mockStats);

    const req = {} as Request;
    const res = createRes();

    await fetchStats(req, res);

    expect(totalJobsSubmitted.set).toHaveBeenCalledWith(10);
    expect(totalJobsCompleted.set).toHaveBeenCalledWith(5);
    expect(queueLengthMetric.set).toHaveBeenCalledWith(2);
    expect(avgProcessingTime.set).toHaveBeenCalledWith(1.2);

    expect(res.json).toHaveBeenCalledWith(mockStats);
  });

  it('should handle error', async () => {
    vi.mocked(statsService.getStats).mockRejectedValue(new Error());

    const req = {} as Request;
    const res = createRes();

    await fetchStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
