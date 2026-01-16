import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { wishlistService } from '../services/wishlist.service';
import type { Product } from '../types/product.types';
import { handleApiError } from '../api/error-handler';

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  hydrated: boolean;
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
  hydrated: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await wishlistService.getWishlist();
      set({ items, isLoading: false, hydrated: true });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  addToWishlist: async (productId) => {
    await wishlistService.addToWishlist(productId);
    await get().fetchWishlist();
  },

  removeFromWishlist: async (productId) => {
    await wishlistService.removeFromWishlist(productId);
    await get().fetchWishlist();
  },

  clearWishlist: async () => {
    await wishlistService.clearWishlist();
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
    hydrated: state.hydrated,
    count: state.items.length,
  }))
);

export const useWishlistActions = () =>
  useWishlistStore(
    useShallow((state) => ({
      fetchWishlist: state.fetchWishlist,
      addToWishlist: state.addToWishlist,
      removeFromWishlist: state.removeFromWishlist,
      clearWishlist: state.clearWishlist,
      isInWishlist: state.isInWishlist,
      clearError: state.clearError,
    }))
  );
