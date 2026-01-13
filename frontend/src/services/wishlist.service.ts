import { apiClient } from '../api/axios-client';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { Product } from '../types/product.types';

export const wishlistService = {
  getWishlist: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/users/me/wishlist');
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  addToWishlist: async (productId: string): Promise<string[]> => {
    try {
      const response = await apiClient.post<string[]>(`/users/me/wishlist/${productId}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  removeFromWishlist: async (productId: string): Promise<string[]> => {
    try {
      const response = await apiClient.delete<string[]>(`/users/me/wishlist/${productId}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  clearWishlist: async (): Promise<string[]> => {
    try {
      const response = await apiClient.delete<string[]>('/users/me/wishlist');
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },
};