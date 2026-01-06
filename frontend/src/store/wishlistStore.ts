import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
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

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await userService.getWishlist();
      set({ items, isLoading: false });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  addToWishlist: async (productId) => {
    await userService.addToWishlist(productId);
    await get().fetchWishlist();
  },

  removeFromWishlist: async (productId) => {
    await userService.removeFromWishlist(productId);
    await get().fetchWishlist();
  },

  clearWishlist: async () => {
    await userService.clearWishlist();
    set({ items: [] });
  },

  isInWishlist: (productId) =>
    get().items.some((item) => item.id === productId),

  clearError: () => set({ error: null }),
}));


export const useWishlist = () => useWishlistStore(
  useShallow((state) => ({
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    count: state.items.length,
  }))
);

export const useWishlistActions = () => useWishlistStore((state) => ({
  fetchWishlist: state.fetchWishlist,
  addToWishlist: state.addToWishlist,
  removeFromWishlist: state.removeFromWishlist,
  clearWishlist: state.clearWishlist,
  isInWishlist: state.isInWishlist,
  clearError: state.clearError,
}));