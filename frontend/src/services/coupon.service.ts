import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import type { Coupon, ValidateCouponDto, CouponValidationResponse } from '../types/coupon.types';

export const couponService = {
  validateCoupon: async (data: ValidateCouponDto): Promise<CouponValidationResponse> => {
    try {
      const response = await apiClient.post<CouponValidationResponse>('/coupons/validate', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  quickCheck: async (code: string): Promise<{ valid: boolean; message?: string }> => {
    try {
      const response = await apiClient.get<{ valid: boolean; message?: string }>(`/coupons/quick-check/${code}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getActiveCoupons: async (): Promise<Partial<Coupon>[]> => {
    try {
      const response = await apiClient.get<Partial<Coupon>[]>('/coupons/public/active');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllCoupons: async (status?: string): Promise<Coupon[]> => {
    try {
      const response = await apiClient.get<Coupon[]>('/coupons', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCouponById: async (id: string): Promise<Coupon> => {
    try {
      const response = await apiClient.get<Coupon>(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};