import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { Cart, AddToCartDto, UpdateCartItemDto, RemoveCartItemDto } from '../types/cart.types';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    try {
      const response = await apiClient.get<ApiResponse<Cart>>('/cart');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  addToCart: async (data: AddToCartDto): Promise<{ cart: Cart; anonymousId?: string }> => {
    try {
      const response = await apiClient.post<{ cart: Cart; anonymousId?: string }>('/cart/items', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateCartItem: async (data: UpdateCartItemDto): Promise<Cart> => {
    try {
      const response = await apiClient.patch<ApiResponse<Cart>>('/cart/items', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  removeFromCart: async (data: RemoveCartItemDto): Promise<Cart> => {
    try {
      const response = await apiClient.delete<ApiResponse<Cart>>('/cart/items', { data });
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  clearCart: async (): Promise<Cart> => {
    try {
      const response = await apiClient.delete<ApiResponse<Cart>>('/cart');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  mergeCart: async (): Promise<{ cart: Cart }> => {
    try {
      const response = await apiClient.post<{ cart: Cart }>('/cart/merge');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};