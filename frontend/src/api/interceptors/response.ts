import type { AxiosError, AxiosResponse } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AxiosRequestConfigWithMeta } from "../types/axiosRequestConfigWithMeta.interface";
import type { ApiErrorResponse } from "../types/apiErrorResponse.interface";
import { apiClient } from "../axios-client";
import { useAuthStore } from "../../store/authStore";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

const IS_PROD = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENVIROMENT === "production";

export const responseInterceptor = async (
  error: AxiosError<ApiErrorResponse>
) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  const { setUser } = useAuthStore.getState();

  if (
    error.response?.status === 401 &&
    originalRequest.method !== "get" &&
    !originalRequest._retry &&
    !originalRequest.url?.includes("/auth/refresh") &&
    !originalRequest.url?.includes("/auth/login")
  ) {
    if (isRefreshing) {
      return new Promise((resolve, reject) =>
        failedQueue.push({ resolve, reject })
      )
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.post("/auth/refresh");
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError);
      setUser(null);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  if (error.response?.status === 429) {
    console.warn("⚠️ Rate limit exceeded.");
  }

  return Promise.reject(error);
};

export const successResponseInterceptor = (
  response: AxiosResponse<unknown>
): AxiosResponse<unknown> => {
  const resConfig = response.config as AxiosRequestConfigWithMeta;
  if (!IS_PROD && resConfig.metadata) {
    const duration =
      new Date().getTime() - resConfig.metadata.startTime.getTime();
    console.log(
      `✅ [API Response] ${response.status} ${response.config.url} (${duration}ms)`
    );
  }
  return response;
};