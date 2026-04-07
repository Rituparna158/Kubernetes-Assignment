import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Request, Response } from 'express';
import router from '../src/routes/stats.routes';
import * as controller from '../src/controllers/stats.controller';

vi.mock('../src/controllers/stats.controller', () => ({
  fetchStats: vi.fn(),
}));

const app = express();
app.use('/api', router);

describe('Stats Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/stats', async () => {
    vi.mocked(controller.fetchStats).mockImplementation(
      async (_req: Request, res: Response) => {
        return res.json({ ok: true });
      },
    );

    const res = await request(app).get('/api/stats');

    expect(res.status).toBe(200);
  });
});
