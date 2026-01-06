import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { Order, CreateOrderDto, CancelOrderDto, OrderQueryDto, PaginatedOrders } from '../types/order.types';

export const orderService = {
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    try {
      const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMyOrders: async (query?: OrderQueryDto): Promise<PaginatedOrders> => {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedOrders>>('/orders/my-orders', {
        params: query,
      });
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMyOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/my-orders/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  cancelMyOrder: async (id: string, data: CancelOrderDto): Promise<Order> => {
    try {
      const response = await apiClient.patch<ApiResponse<Order>>(`/orders/my-orders/${id}/cancel`, data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllOrders: async (query?: OrderQueryDto): Promise<PaginatedOrders> => {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedOrders>>('/orders', {
        params: query,
      });
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};