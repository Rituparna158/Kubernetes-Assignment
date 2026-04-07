import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitJob, getStatus } from '../src/controllers/job.controller';
import * as jobService from '../src/services/job.service';
import { jobSubmitted } from '../src/metrics/metrics';
import { Request, Response } from 'express';

vi.mock('../src/services/job.service', () => ({
  addJobToQueue: vi.fn(),
  getJobStatus: vi.fn(),
  getJobResult: vi.fn(),
}));

vi.mock('../src/metrics/metrics', () => ({
  jobSubmitted: {
    inc: vi.fn(),
  },
}));

const createRes = (): Response => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('Job Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submitJob success', async () => {
    const req = {
      body: { type: 'prime', payload: { limit: 100 } },
    } as Request;

    const res = createRes();

    vi.mocked(jobService.addJobToQueue).mockResolvedValue(undefined);

    await submitJob(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('submitJob invalid type', async () => {
    const req = { body: { type: 'wrong' } } as Request;
    const res = createRes();

    await submitJob(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('submitJob error', async () => {
    const req = { body: { type: 'prime' } } as Request;
    const res = createRes();

    vi.mocked(jobService.addJobToQueue).mockRejectedValue(new Error());

    await submitJob(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('getStatus pending', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = createRes();

    vi.mocked(jobService.getJobStatus).mockResolvedValue('pending');
    vi.mocked(jobService.getJobResult).mockResolvedValue(null);

    await getStatus(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it('getStatus completed', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = createRes();

    vi.mocked(jobService.getJobStatus).mockResolvedValue('done');
    vi.mocked(jobService.getJobResult).mockResolvedValue(
      JSON.stringify({ ok: true }),
    );

    await getStatus(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: expect.any(String),
      result: { ok: true },
    });
  });

  it('getStatus 404', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = createRes();

    vi.mocked(jobService.getJobStatus).mockResolvedValue(null);

    await getStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
