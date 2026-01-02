import type { InternalAxiosRequestConfig } from "axios";

export interface AxiosRequestConfigWithMeta extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}