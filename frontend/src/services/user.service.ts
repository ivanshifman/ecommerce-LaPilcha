import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { Product } from '../types/product.types';
import type { AdminUserResponse, UpdateUserAdminDto } from '../types/user.types';

export const userService = {
  getWishlist: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/users/me/wishlist');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addToWishlist: async (productId: string): Promise<string[]> => {
    try {
      const response = await apiClient.post<string[]>(`/users/me/wishlist/${productId}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  removeFromWishlist: async (productId: string): Promise<string[]> => {
    try {
      const response = await apiClient.delete<string[]>(`/users/me/wishlist/${productId}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  clearWishlist: async (): Promise<string[]> => {
    try {
      const response = await apiClient.delete<string[]>('/users/me/wishlist');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllUsers: async (): Promise<AdminUserResponse[]> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminUserResponse[]>>('/users');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUserById: async (id: string): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<AdminUserResponse>>(`/users/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateUser: async (id: string, data: UpdateUserAdminDto): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.patch<ApiResponse<AdminUserResponse>>(`/users/${id}`, data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteUser: async (id: string): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.delete<ApiResponse<AdminUserResponse>>(`/users/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};