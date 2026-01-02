import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import type { Shipping, ShippingOption, CalculateShippingDto } from '../types/shipping.types';

export const shippingService = {
  calculateShipping: async (data: CalculateShippingDto): Promise<ShippingOption[]> => {
    try {
      const response = await apiClient.post<ShippingOption[]>('/shipping/calculate', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getShippingByOrder: async (orderId: string): Promise<Shipping> => {
    try {
      const response = await apiClient.get<Shipping>(`/shipping/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllShippings: async (status?: string): Promise<Shipping[]> => {
    try {
      const response = await apiClient.get<Shipping[]>('/shipping', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getShippingById: async (id: string): Promise<Shipping> => {
    try {
      const response = await apiClient.get<Shipping>(`/shipping/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};