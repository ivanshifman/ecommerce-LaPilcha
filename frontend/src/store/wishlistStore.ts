import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userService } from '../services/user.service';
import type { Product } from '../types/product.types';
import { handleApiError } from '../api/error-handler';

interface WishlistState {
    items: Product[];
    isLoading: boolean;
    error: string | null;
    fetchWishlist: () => Promise<void>;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    clearWishlist: () => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    clearError: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            error: null,

            fetchWishlist: async () => {
                set({ isLoading: true, error: null });
                try {
                    const items = await userService.getWishlist();
                    set({ items, isLoading: false });
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            addToWishlist: async (productId) => {
                set({ isLoading: true, error: null });
                try {
                    await userService.addToWishlist(productId);
                    await get().fetchWishlist();
                    set({ isLoading: false });
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            removeFromWishlist: async (productId) => {
                set({ isLoading: true, error: null });
                try {
                    await userService.removeFromWishlist(productId);
                    await get().fetchWishlist();
                    set({ isLoading: false });
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            clearWishlist: async () => {
                set({ isLoading: true, error: null });
                try {
                    await userService.clearWishlist();
                    set({ items: [], isLoading: false });
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            isInWishlist: (productId) => {
                const { items } = get();
                return items.some(item => item.id === productId);
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                items: state.items
            }),
        }
    )
);

export const useWishlist = () => useWishlistStore((state) => ({
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    count: state.items.length,
}));

export const useWishlistActions = () => useWishlistStore((state) => ({
    fetchWishlist: state.fetchWishlist,
    addToWishlist: state.addToWishlist,
    removeFromWishlist: state.removeFromWishlist,
    clearWishlist: state.clearWishlist,
    isInWishlist: state.isInWishlist,
    clearError: state.clearError,
}));