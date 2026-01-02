import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import type { Payment, CreatePaymentDto } from '../types/payment.types';

export const paymentService = {
  createPayment: async (data: CreatePaymentDto): Promise<Payment> => {
    try {
      const response = await apiClient.post<Payment>('/payments', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPaymentByOrderId: async (orderId: string): Promise<Payment> => {
    try {
      const response = await apiClient.get<Payment>(`/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMyPayments: async (): Promise<Payment[]> => {
    try {
      const response = await apiClient.get<Payment[]>('/payments/my-payments');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllPayments: async (): Promise<Payment[]> => {
    try {
      const response = await apiClient.get<Payment[]>('/payments');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
      }
  },

  refundPayment: async (paymentId: string): Promise<Payment> => {
    try {
      const response = await apiClient.post<Payment>(`/payments/${paymentId}/refund`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};