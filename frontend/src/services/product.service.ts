import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import type { Product, ProductFilters, PaginatedProducts } from '../types/product.types';

export const productService = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedProducts> => {
    try {
      const response = await apiClient.get<PaginatedProducts>('/products', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getBySlug: async (slug: string): Promise<Product> => {
    try {
      const response = await apiClient.get<Product>(`/products/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<Product[]>('/products/featured');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  search: async (query: string): Promise<Product[]> => {
    try {
      const response = await apiClient.get<Product[]>('/products/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};