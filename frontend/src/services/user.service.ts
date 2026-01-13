import { apiClient } from '../api/axios-client';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { AdminUserResponse, UpdateUserAdminDto } from '../types/user.types';

export const userService = {
  // Admin endpoints
  getAllUsers: async (): Promise<AdminUserResponse[]> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminUserResponse[]>>('/users');
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id: string): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminUserResponse>>(`/users/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id: string, data: UpdateUserAdminDto): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.patch<ApiResponse<AdminUserResponse>>(`/users/${id}`, data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.delete<ApiResponse<AdminUserResponse>>(`/users/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },
};