import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Request, Response } from 'express';
import router from '../src/routes/job.routes';
import * as controller from '../src/controllers/job.controller';

vi.mock('../src/controllers/job.controller', () => ({
  submitJob: vi.fn(),
  getStatus: vi.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/submit', async () => {
    vi.mocked(controller.submitJob).mockImplementation(
      async (_req: Request, res: Response) => {
        return res.status(201).json({ ok: true });
      },
    );

    const res = await request(app).post('/api/submit').send({ type: 'prime' });

    expect(res.status).toBe(201);
  });

  it('GET /api/status/:id', async () => {
    vi.mocked(controller.getStatus).mockImplementation(
      async (_req: Request, res: Response) => {
        return res.json({ status: 'done' });
      },
    );

    const res = await request(app).get('/api/status/1');

    expect(res.status).toBe(200);
  });
});
