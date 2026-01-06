import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { Shipping, ShippingOption, CalculateShippingDto } from '../types/shipping.types';

export const shippingService = {
  calculateShipping: async (data: CalculateShippingDto): Promise<ShippingOption[]> => {
    try {
      const response = await apiClient.post<ApiResponse<ShippingOption[]>>('/shipping/calculate', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getShippingByOrder: async (orderId: string): Promise<Shipping> => {
    try {
      const response = await apiClient.get<ApiResponse<Shipping>>(`/shipping/order/${orderId}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllShippings: async (status?: string): Promise<Shipping[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Shipping[]>>('/shipping', {
        params: { status },
      });
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getShippingById: async (id: string): Promise<Shipping> => {
    try {
      const response = await apiClient.get<ApiResponse<Shipping>>(`/shipping/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};