import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import type { Order, CreateOrderDto, CancelOrderDto, OrderQueryDto, PaginatedOrders } from '../types/order.types';

export const orderService = {
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    try {
      const response = await apiClient.post<Order>('/orders', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMyOrders: async (query?: OrderQueryDto): Promise<PaginatedOrders> => {
    try {
      const response = await apiClient.get<PaginatedOrders>('/orders/my-orders', {
        params: query,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMyOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<Order>(`/orders/my-orders/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  cancelMyOrder: async (id: string, data: CancelOrderDto): Promise<Order> => {
    try {
      const response = await apiClient.patch<Order>(`/orders/my-orders/${id}/cancel`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllOrders: async (query?: OrderQueryDto): Promise<PaginatedOrders> => {
    try {
      const response = await apiClient.get<PaginatedOrders>('/orders', {
        params: query,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};