import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStats } from '../src/services/stats.service';
import { connection } from '../src/config/redis';

vi.mock('../src/config/redis', () => ({
  connection: {
    get: vi.fn(),
    llen: vi.fn(),
    lrange: vi.fn(),
  },
}));

describe('Stats Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return computed stats', async () => {
    vi.mocked(connection.get)
      .mockResolvedValueOnce('10') // submitted
      .mockResolvedValueOnce('5'); // completed

    vi.mocked(connection.llen).mockResolvedValue(3);

    vi.mocked(connection.lrange).mockResolvedValue(['1000', '2000']); // ms

    const result = await getStats();

    expect(result).toEqual({
      total_jobs_submitted: 10,
      total_jobs_completed: 5,
      queue_length: 3,
      avg_processing_time: 1.5,
    });
  });

  it('should handle empty times', async () => {
    vi.mocked(connection.get)
      .mockResolvedValueOnce('0')
      .mockResolvedValueOnce('0');

    vi.mocked(connection.llen).mockResolvedValue(0);
    vi.mocked(connection.lrange).mockResolvedValue([]);

    const result = await getStats();

    expect(result.avg_processing_time).toBe(0);
  });
});
