export interface StatsResponse {
  total_jobs_submitted: number;
  total_jobs_completed: number;
  queue_length: number;
  avg_processing_time: number;
}
