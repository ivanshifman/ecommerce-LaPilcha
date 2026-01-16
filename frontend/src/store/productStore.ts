import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { productService } from '../services/product.service';
import type { Product, ProductFilters } from '../types/product.types';
import { handleApiError } from '../api/error-handler';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  featuredProducts: Product[];
  categories: string[];
  genders: string[];
  brands: string[];
  pagination: {
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  sizes: string[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchGenders: () => Promise<void>;
  fetchCategoriesByGender: (gender: string) => Promise<string[]>;
  fetchCategories: () => Promise<void>;
  fetchSubcategories: (category: string) => Promise<string[]>;
  fetchSizes: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchFilteredSizes: (filters?: ProductFilters) => Promise<void>;
  fetchFilteredBrands: (filters?: ProductFilters) => Promise<void>;
  fetchFilteredCategories: (filters?: ProductFilters) => Promise<void>;
  fetchFilteredSubcategories: (filters?: ProductFilters) => Promise<string[]>;
  searchProducts: (query: string) => Promise<Product[]>;
  clearCurrentProduct: () => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  featuredProducts: [],
  genders: [],
  brands: [],
  categories: [],
  pagination: null,
  sizes: [],
  isLoading: false,
  error: null,

  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getAll(filters);
      set({
        products: response.docs,
        pagination: {
          totalDocs: response.totalDocs,
          limit: response.limit,
          page: response.page,
          totalPages: response.totalPages,
          hasNextPage: response.hasNextPage,
          hasPrevPage: response.hasPrevPage,
        },
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.getById(id);
      set({ currentProduct: product, isLoading: false });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  fetchProductBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.getBySlug(slug);
      set({ currentProduct: product, isLoading: false });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  fetchFeatured: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await productService.getFeatured();
      set({ featuredProducts: products, isLoading: false });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  fetchGenders: async () => {
    try {
      const genders = await productService.getGenders();
      set({ genders });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  fetchCategoriesByGender: async (gender) => {
    try {
      return await productService.getCategoriesByGender(gender);
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },


  fetchCategories: async () => {
    try {
      const categories = await productService.getCategories();
      set({ categories });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  fetchSubcategories: async (category) => {
    try {
      return await productService.getSubcategoriesByCategory(category);
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  fetchSizes: async () => {
    try {
      const sizes = await productService.getSizes();
      set({ sizes });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  fetchBrands: async () => {
    try {
      const brands = await productService.getBrands();
      set({ brands });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  fetchFilteredSizes: async (filters) => {
    try {
      const sizes = await productService.getSizesFiltered(filters);
      set({ sizes });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  fetchFilteredBrands: async (filters) => {
    try {
      const brands = await productService.getBrandsFiltered(filters);
      set({ brands });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  fetchFilteredCategories: async (filters) => {
    try {
      const categories = await productService.getCategoriesFiltered(filters);
      set({ categories });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  fetchFilteredSubcategories: async (filters) => {
    try {
      return await productService.getSubcategoriesFiltered(filters);
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  searchProducts: async (query) => {
    try {
      return await productService.search(query);
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
      throw error;
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null }),

  clearSizes: () => set({ sizes: [] }),

  clearError: () => set({ error: null }),
}));

export const useProducts = () => useProductStore(
  useShallow((state) => ({
    products: state.products,
    currentProduct: state.currentProduct,
    featuredProducts: state.featuredProducts,
    genders: state.genders,
    categories: state.categories,
    sizes: state.sizes,
    brands: state.brands,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
  }))
);

export const useProductActions = () => useProductStore(
  useShallow((state) => ({
    fetchProducts: state.fetchProducts,
    fetchProductById: state.fetchProductById,
    fetchProductBySlug: state.fetchProductBySlug,
    fetchFeatured: state.fetchFeatured,
    fetchGenders: state.fetchGenders,
    fetchCategoriesByGender: state.fetchCategoriesByGender,
    fetchCategories: state.fetchCategories,
    fetchSubcategories: state.fetchSubcategories,
    fetchSizes: state.fetchSizes,
    fetchBrands: state.fetchBrands,
    fetchFilteredSizes: state.fetchFilteredSizes,
    fetchFilteredBrands: state.fetchFilteredBrands,
    fetchFilteredCategories: state.fetchFilteredCategories,
    fetchFilteredSubcategories: state.fetchFilteredSubcategories,
    searchProducts: state.searchProducts,
    clearCurrentProduct: state.clearCurrentProduct,
    clearError: state.clearError,
  }))
);