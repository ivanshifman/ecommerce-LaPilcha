import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { Coupon, ValidateCouponDto, CouponValidationResponse } from '../types/coupon.types';

export const couponService = {
  validateCoupon: async (data: ValidateCouponDto): Promise<CouponValidationResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<CouponValidationResponse>>('/coupons/validate', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  quickCheck: async (code: string): Promise<{ valid: boolean; message?: string }> => {
    try {
      const response = await apiClient.get<{ valid: boolean; message?: string }>(`/coupons/quick-check/${code}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getActiveCoupons: async (): Promise<Partial<Coupon>[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Partial<Coupon>[]>>('/coupons/public/active');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin endpoints
  getAllCoupons: async (status?: string): Promise<Coupon[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Coupon[]>>('/coupons', {
        params: { status },
      });
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCouponById: async (id: string): Promise<Coupon> => {
    try {
      const response = await apiClient.get<ApiResponse<Coupon>>(`/coupons/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};