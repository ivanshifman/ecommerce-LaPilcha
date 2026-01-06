import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { Return, CreateReturnDto } from '../types/return.types';

export const returnService = {
  createReturn: async (data: CreateReturnDto): Promise<Return> => {
    try {
      const response = await apiClient.post<ApiResponse<Return>>('/returns', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMyReturns: async (): Promise<Return[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Return[]>>('/returns/my-returns');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getReturnById: async (id: string): Promise<Return> => {
    try {
      const response = await apiClient.get<ApiResponse<Return>>(`/returns/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllReturns: async (status?: string): Promise<Return[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Return[]>>('/returns/admin/all', {
        params: { status },
      });
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};