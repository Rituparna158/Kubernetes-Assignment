export type JobType = 'prime' | 'bcrypt' | 'array';

export interface Job {
  id: string;
  type: JobType;
  payload: {
    limit?: number;
    rounds?: number;
    size?: number;
  };
}
