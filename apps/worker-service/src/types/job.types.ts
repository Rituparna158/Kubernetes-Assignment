export type JobType = 'prime' | 'array';

export interface JobPayload {
  limit?: number;
  size?: number;
}

export interface Job {
  id: string;
  type: JobType;
  payload: JobPayload;
}
