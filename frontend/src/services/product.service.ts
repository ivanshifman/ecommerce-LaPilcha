import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type { Product, ProductFilters, PaginatedProducts } from '../types/product.types';

export const productService = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedProducts> => {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedProducts>>('/products', {
        params: filters,
      });
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getBySlug: async (slug: string): Promise<Product> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/slug/${slug}`);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/meta/featured');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  search: async (query: string): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedProducts>>('/products', {
        params: { search: query, limit: 10 },
      });
      const paginatedData = unwrapResponse(response.data);
      return paginatedData.docs;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getGenders: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>('/products/meta/genders');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>('/products/meta/categories');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getCategoriesByGender: async (gender: string): Promise<string[]> => {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        `/products/meta/genders/${gender}/categories`
      );
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getSubcategoriesByCategory: async (category: string): Promise<string[]> => {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        `/products/meta/categories/${category}/subcategories`
      );
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};