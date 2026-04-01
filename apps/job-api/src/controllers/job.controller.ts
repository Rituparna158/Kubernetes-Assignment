import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  addJobToQueue,
  getJobStatus,
  getJobResult,
} from '../services/job.service';
import { jobSubmitted } from '../metrics/metrics';
import { MESSAGES } from '../constants/message';
import { HTTP_STATUS } from '../constants/http-status';
import { Job, JobType } from '../types/job.types';

export const submitJob = async (req: Request, res: Response) => {
  try {
    const jobId = uuidv4();

    const { type, payload } = req.body;

    if (!type) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: MESSAGES.JOB_REQUIRED,
      });
    }

    const allowedTypes: JobType[] = ['prime', 'bcrypt', 'array'];

    if (!allowedTypes.includes(type)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: MESSAGES.JOB_INVALD,
      });
    }

    if (type === 'prime' && payload?.limit > 5000000) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: MESSAGES.LIMIT_LARGE,
      });
    }

    const job: Job = {
      id: jobId,
      type,
      payload: payload || {},
    };

    await addJobToQueue(job);
    jobSubmitted.inc({ type });

    res
      .status(HTTP_STATUS.CREATED)
      .json({ jobId, message: MESSAGES.JOB_SUBMIT_SUCCESS });
  } catch {
    res
      .status(HTTP_STATUS.INTERNAL_ERROR)
      .json({ error: MESSAGES.JOB_SUBMISSION_FAILED });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;

    const status = await getJobStatus(jobId as string);
    const result = await getJobResult(jobId as string);

    if (!status || status === 'pending') {
      return res.json({ status: MESSAGES.JOB_STATUS_PENDING });
    }

    res.json({
      status: MESSAGES.JOB_STATUS_COMPLETED,
      result: result ? JSON.parse(result) : null,
    });
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: MESSAGES.JOB_STATUS_FETCH_FAILED,
    });
  }
};
