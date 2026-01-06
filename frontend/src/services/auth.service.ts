import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
import { ApiResponse, unwrapResponse } from '../api/helper';
import type {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ResendVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateUserDto,
  AuthResponse,
  RegisterResponse,
  ProfileResponse,
} from '../types/auth.types';

export const authService = {
  register: async (data: RegisterDto): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  verifyEmail: async (data: VerifyEmailDto): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-email', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  resendCode: async (data: ResendVerificationDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/resend-code', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  forgotPassword: async (data: ForgotPasswordDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/forgot-password', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  resetPassword: async (data: ResetPasswordDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/reset-password', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  changePassword: async (data: ChangePasswordDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/change-password', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/logout');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  refresh: async (): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<ProfileResponse>>('/auth/profile');
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProfile: async (data: UpdateUserDto): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.patch<ApiResponse<ProfileResponse>>('/auth/profile', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  loginWithGoogle: (): void => {
    window.location.href = `${apiClient.defaults.baseURL}/auth/google`;
  },

  loginWithApple: (): void => {
    window.location.href = `${apiClient.defaults.baseURL}/auth/apple`;
  },
};