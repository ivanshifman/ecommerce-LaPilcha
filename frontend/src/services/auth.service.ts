import { apiClient } from '../api/axios-client';
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
      throw error;
    }
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (data: VerifyEmailDto): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-email', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  resendCode: async (data: ResendVerificationDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/resend-code', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  getUserIdByEmail: async (email: string): Promise<{ userId: string }> => {
    try {
      console.log('🔍 Requesting userId for email:', email);

      const response = await apiClient.post<ApiResponse<{ userId: string }>>(
        '/auth/get-user-id',
        { email }
      );

      const data = response.data.data || response.data;

      if (!data || !data.userId) {
        console.error('❌ Invalid response format:', response.data);
        throw new Error('Respuesta inválida del servidor');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (data: ForgotPasswordDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/forgot-password', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (data: ResetPasswordDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/reset-password', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (data: ChangePasswordDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/change-password', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/logout');
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  refresh: async (): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<ProfileResponse>>('/auth/profile');
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (data: UpdateUserDto): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.patch<ApiResponse<ProfileResponse>>('/auth/profile', data);
      return unwrapResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  loginWithGoogle: (): void => {
    window.location.href = `${apiClient.defaults.baseURL}/auth/google`;
  },

  loginWithApple: (): void => {
    window.location.href = `${apiClient.defaults.baseURL}/auth/apple`;
  },
};