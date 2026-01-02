import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import type { Product } from '../types/product.types';
import type { AdminUserResponse, UpdateUserAdminDto } from '../types/user.types';

export const userService = {
  // Wishlist
  getWishlist: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<Product[]>('/users/me/wishlist');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addToWishlist: async (productId: string): Promise<string[]> => {
    try {
      const response = await apiClient.post<string[]>(`/users/me/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  removeFromWishlist: async (productId: string): Promise<string[]> => {
    try {
      const response = await apiClient.delete<string[]>(`/users/me/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  clearWishlist: async (): Promise<string[]> => {
    try {
      const response = await apiClient.delete<string[]>('/users/me/wishlist');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllUsers: async (): Promise<AdminUserResponse[]> => {
    try {
      const response = await apiClient.get<AdminUserResponse[]>('/users');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getUserById: async (id: string): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.get<AdminUserResponse>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateUser: async (id: string, data: UpdateUserAdminDto): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.patch<AdminUserResponse>(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteUser: async (id: string): Promise<AdminUserResponse> => {
    try {
      const response = await apiClient.delete<AdminUserResponse>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};