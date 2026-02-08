import type { AxiosError, AxiosResponse } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AxiosRequestConfigWithMeta } from "../types/axiosRequestConfigWithMeta.interface";
import type { ApiErrorResponse } from "../types/apiErrorResponse.interface";
import { apiClient } from "../axios-client";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

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

  const { logout } = useAuthStore.getState();

  const authEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/get-user-id',
    '/auth/verify-email',
    '/auth/resend-code',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/refresh',
  ];

  if (authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))) {
    return Promise.reject(error);
  }

  if (
    error.response?.status === 401 &&
    !originalRequest._retry
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
      const refreshResponse = await apiClient.post("/auth/refresh");
      processQueue(null);

      if (refreshResponse.data?.data?.expiresIn) {
        const { scheduleTokenRefresh } = await import('../../lib/auth/tokenRefresh');
        scheduleTokenRefresh(refreshResponse.data.data.expiresIn);
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError);
      await logout();
      useCartStore.setState({ cart: null });

      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }

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