import axios from "axios";
import type { ApiErrorResponse } from "./types/apiErrorResponse.interface";

export const handleApiError = (
  error: unknown
): {
  message: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
  method?: string;
  error?: string;
} => {
  if (axios.isAxiosError(error)) {
    const { response, code, message: msg } = error;
    const data = response?.data as ApiErrorResponse | undefined;

    return {
      message:
        data?.message ||
        (code === "ECONNABORTED"
          ? "Request timeout"
          : code === "ERR_NETWORK"
          ? "Network error"
          : msg),
      statusCode: data?.statusCode || response?.status || 500,
      timestamp: data?.timestamp,
      path: data?.path,
      method: data?.method,
      error: data?.error,
    };
  }

  return { message: "Unexpected error occurred", statusCode: 500 };
};