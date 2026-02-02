import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { shippingService } from '../services/shipping.service';
import { handleApiError } from '../api/error-handler';
import { ShippingOption } from '../types/shipping.types';

interface ShippingState {
    options: ShippingOption[];
    selectedMethod: string | null;
    isCalculating: boolean;
    error: string | null;
    calculateShipping: (province: string, subtotal: number, weight?: number) => Promise<void>;
    setSelectedMethod: (method: string) => void;
    clearOptions: () => void;
    clearError: () => void;
}

export const useShippingStore = create<ShippingState>((set) => ({
    options: [],
    selectedMethod: null,
    isCalculating: false,
    error: null,

    calculateShipping: async (province: string, subtotal: number, weight?: number) => {
        set({ isCalculating: true, error: null });
        try {
            const options = await shippingService.calculateShipping({
                province,
                subtotal,
                weight,
            });
            set({
                options,
                isCalculating: false,
                selectedMethod: options.length > 0 ? options[0].method : null,
            });
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isCalculating: false, options: [] });
            throw error;
        }
    },

    setSelectedMethod: (method: string) => set({ selectedMethod: method }),

    clearOptions: () => set({ options: [], selectedMethod: null }),

    clearError: () => set({ error: null }),
}));

export const useShipping = () =>
    useShippingStore(
        useShallow((state) => ({
            options: state.options,
            selectedMethod: state.selectedMethod,
            isCalculating: state.isCalculating,
            error: state.error,
        }))
    );

export const useShippingActions = () =>
    useShippingStore(
        useShallow((state) => ({
            calculateShipping: state.calculateShipping,
            setSelectedMethod: state.setSelectedMethod,
            clearOptions: state.clearOptions,
            clearError: state.clearError,
        }))
    );