import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import type { Return, CreateReturnDto } from '../types/return.types';

export const returnService = {
  createReturn: async (data: CreateReturnDto): Promise<Return> => {
    try {
      const response = await apiClient.post<Return>('/returns', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMyReturns: async (): Promise<Return[]> => {
    try {
      const response = await apiClient.get<Return[]>('/returns/my-returns');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getReturnById: async (id: string): Promise<Return> => {
    try {
      const response = await apiClient.get<Return>(`/returns/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllReturns: async (status?: string): Promise<Return[]> => {
    try {
      const response = await apiClient.get<Return[]>('/returns/admin/all', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};