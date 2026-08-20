export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface HealthStatus {
  status: string;
  version: string;
  environment: string;
  database_connected: boolean;
  llm_mode: string;
}
