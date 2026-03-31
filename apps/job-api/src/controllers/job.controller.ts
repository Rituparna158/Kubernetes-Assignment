import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addJobToQueue, getJobResult } from '../services/job.service';
import { jobSubmitted } from '../metrics/metrics';
import { MESSAGES } from '../constants/message';
import { HTTP_STATUS } from '../constants/http-status';
import { Job } from '../types/job.types';

export const submitJob = async (req: Request, res: Response) => {
  try {
    const jobId = uuidv4();

    const job: Job = {
      id: jobId,
      type: 'prime',
      payload: {
        limit: 2000000,
      },
    };

    await addJobToQueue(job);
    jobSubmitted.inc();

    res.json({ jobId, message: MESSAGES.JOB_SUBMIT_SUCCESS });
  } catch {
    res
      .status(HTTP_STATUS.INTERNAL_ERROR)
      .json({ error: MESSAGES.JOB_SUBMISSION_FAILED });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  const jobId = req.params.id;

  const result = await getJobResult(jobId as string);

  if (!result) {
    return res.json({ status: MESSAGES.JOB_STATUS_PENDING });
  }

  res.json({
    status: MESSAGES.JOB_STATUS_COMPLETED,
    result: JSON.parse(result),
  });
};
