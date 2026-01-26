import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { cartService } from '../services/cart.service';
import type {
    Cart,
    AddToCartDto,
    UpdateCartItemDto,
    RemoveCartItemDto,
} from '../types/cart.types';
import { handleApiError } from '../api/error-handler';

interface CartState {
    cart: Cart | null;
    isFetching: boolean;
    isMutating: boolean;
    error: string | null;
    fetchCart: () => Promise<void>;
    addToCart: (data: AddToCartDto) => Promise<void>;
    updateCartItem: (data: UpdateCartItemDto) => Promise<void>;
    removeFromCart: (data: RemoveCartItemDto) => Promise<void>;
    clearCart: () => Promise<void>;
    clearError: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    cart: null,
    isFetching: false,
    isMutating: false,
    error: null,

    fetchCart: async () => {
        set({ isFetching: true, cart: null });
        try {
            const cart = await cartService.getCart();
            set({ cart, isFetching: false });
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isFetching: false, cart: null });
            throw error;
        }
    },
    
    addToCart: async (data) => {
        set({ isMutating: true });
        try {
            const { cart } = await cartService.addToCart(data);
            set({ cart, isMutating: false });
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isMutating: false });
            throw error;
        }
    },

    updateCartItem: async (data) => {
        set({ isMutating: true });
        try {
            const cart = await cartService.updateCartItem(data);
            set({ cart, isMutating: false });
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isMutating: false });
            throw error;
        }
    },

    removeFromCart: async (data) => {
        set({ isMutating: true });
        try {
            const cart = await cartService.removeFromCart(data);
            set({ cart, isMutating: false });
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isMutating: false });
            throw error;
        }
    },

    clearCart: async () => {
        set({ isMutating: true });
        try {
            const cart = await cartService.clearCart();
            set({ cart, isMutating: false });
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isMutating: false });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));


export const useCart = () => useCartStore(
    useShallow((state) => ({
        cart: state.cart,
        isFetching: state.isFetching,
        isMutating: state.isMutating,
        error: state.error,
    }))
);

export const useCartActions = () => useCartStore(
    useShallow((state) => ({
        fetchCart: state.fetchCart,
        addToCart: state.addToCart,
        updateCartItem: state.updateCartItem,
        removeFromCart: state.removeFromCart,
        clearCart: state.clearCart,
        clearError: state.clearError,
    }))
);