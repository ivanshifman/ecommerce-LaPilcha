import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cartService } from '../services/cart.service';
import type { Cart, AddToCartDto, UpdateCartItemDto, RemoveCartItemDto } from '../types/cart.types';
import { handleApiError } from '../api/error-handler';

interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    error: string | null;

    fetchCart: () => Promise<void>;
    addToCart: (data: AddToCartDto) => Promise<void>;
    updateCartItem: (data: UpdateCartItemDto) => Promise<void>;
    removeFromCart: (data: RemoveCartItemDto) => Promise<void>;
    clearCart: () => Promise<void>;
    clearError: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: null,
            isLoading: false,
            error: null,

            fetchCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    const cart = await cartService.getCart();
                    set({ cart, isLoading: false });
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            addToCart: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await cartService.addToCart(data);
                    set({ cart: response.cart, isLoading: false });
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            updateCartItem: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const cart = await cartService.updateCartItem(data);
                    set({ cart, isLoading: false });
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            removeFromCart: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const cart = await cartService.removeFromCart(data);
                    set({ cart, isLoading: false });
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            clearCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    const cart = await cartService.clearCart();
                    set({ cart, isLoading: false });
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            clearError: () => set({ error: null }),

            getItemCount: () => {
                const { cart } = get();
                return cart?.itemCount || 0;
            },

            getSubtotal: () => {
                const { cart } = get();
                return cart?.subtotal || 0;
            },

            getTotal: () => {
                const { cart } = get();
                return cart?.total || 0;
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                cart: state.cart
            }),
        }
    )
);

export const useCart = () => useCartStore((state) => ({
    cart: state.cart,
    isLoading: state.isLoading,
    error: state.error,
    itemCount: state.getItemCount(),
    subtotal: state.getSubtotal(),
    total: state.getTotal(),
}));

export const useCartActions = () => useCartStore((state) => ({
    fetchCart: state.fetchCart,
    addToCart: state.addToCart,
    updateCartItem: state.updateCartItem,
    removeFromCart: state.removeFromCart,
    clearCart: state.clearCart,
    clearError: state.clearError,
}));