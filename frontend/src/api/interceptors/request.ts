import type { AxiosRequestConfigWithMeta } from "../types/axiosRequestConfigWithMeta.interface";

const IS_PROD = process.env.NODE_ENV === "production";

export const requestInterceptor = (config: AxiosRequestConfigWithMeta) => {
  if (!IS_PROD) {
    config.metadata = { startTime: new Date() };
    config.headers['Accept'] = 'application/json';
    console.log(
      `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`
    );
  }
  return config;
};