import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import * as jobService from '../src/services/job.service';

vi.mock('../src/services/job.service', () => ({
  addJobToQueue: vi.fn().mockResolvedValue(undefined),
  getJobStatus: vi.fn(),
  getJobResult: vi.fn(),
}));

describe('Job API', () => {
  it('should submit job', async () => {
    const res = await request(app)
      .post('/api/submit')
      .send({ type: 'prime', payload: { limit: 1000 } });

    expect(res.status).toBe(201);
  });

  it('should fail invalid type', async () => {
    const res = await request(app).post('/api/submit').send({ type: 'wrong' });

    expect(res.status).toBe(400);
  });

  it('should return 404', async () => {
    vi.mocked(jobService.getJobStatus).mockResolvedValue(null);

    const res = await request(app).get('/api/status/fake-id');

    expect(res.status).toBe(404);
  });
});
