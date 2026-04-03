export type JobType = 'prime' | 'bcrypt' | 'array';

export interface JobPayload {
  limit?: number;
  rounds?: number;
  size?: number;
}

export interface Job {
  id: string;
  type: JobType;
  payload: JobPayload;
}
