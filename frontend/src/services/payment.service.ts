import { apiClient } from '../api/axios-client';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { Payment, CreatePaymentDto } from '../types/payment.types';

export const paymentService = {
  createPayment: async (data: CreatePaymentDto): Promise<Payment> => {
    try {
      const response = await apiClient.post<ApiResponse<Payment>>('/payments', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  getPaymentByOrderId: async (orderId: string): Promise<Payment> => {
    try {
      const response = await apiClient.get<ApiResponse<Payment>>(`/payments/order/${orderId}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  getMyPayments: async (): Promise<Payment[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Payment[]>>('/payments/my-payments');
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  // Admin endpoints
  getAllPayments: async (): Promise<Payment[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Payment[]>>('/payments');
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  refundPayment: async (paymentId: string): Promise<Payment> => {
    try {
      const response = await apiClient.post<ApiResponse<Payment>>(`/payments/${paymentId}/refund`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },
};