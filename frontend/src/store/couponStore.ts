import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { couponService } from '../services/coupon.service';
import type { ValidateCouponDto, CouponValidationResponse } from '../types/coupon.types';
import { handleApiError } from '../api/error-handler';

interface CouponState {
    appliedCoupon: CouponValidationResponse | null;
    isValidating: boolean;
    error: string | null;
    validateCoupon: (data: ValidateCouponDto) => Promise<void>;
    removeCoupon: () => void;
    clearError: () => void;
}

export const useCouponStore = create<CouponState>((set) => ({
    appliedCoupon: null,
    isValidating: false,
    error: null,

    validateCoupon: async (data) => {
        set({ isValidating: true, error: null });
        try {
            const result = await couponService.validateCoupon(data);
            if (result.valid) {
                set({
                    appliedCoupon: result,
                    isValidating: false
                });
            } else {
                set({
                    error: result.message || 'Cupón inválido',
                    isValidating: false,
                    appliedCoupon: null
                });
                throw new Error(result.message || 'Cupón inválido');
            }
        } catch (error: unknown) {
            const apiError = handleApiError(error);

            set({
                error: apiError.message,
                isValidating: false,
                appliedCoupon: null
            });

            throw error;
        }
    },

    removeCoupon: () => set({ appliedCoupon: null, error: null }),

    clearError: () => set({ error: null }),
}));

export const useCoupon = () => useCouponStore(
    useShallow((state) => ({
        appliedCoupon: state.appliedCoupon,
        isValidating: state.isValidating,
        error: state.error,
        discountAmount: state.appliedCoupon?.discountAmount || 0,
        freeShipping: state.appliedCoupon?.freeShipping || false,
    }))
);

export const useCouponActions = () => useCouponStore(
    useShallow((state) => ({
        validateCoupon: state.validateCoupon,
        removeCoupon: state.removeCoupon,
        clearError: state.clearError,
    }))
);