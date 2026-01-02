export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  message: string;
  error?: string;
  stack?: string;
  path?: string;
  method?: string;
}