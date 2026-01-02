import { apiClient } from '../api/axios-client';
import { handleApiError } from '../api/error-handler';
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
      const response = await apiClient.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  verifyEmail: async (data: VerifyEmailDto): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/verify-email', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  resendCode: async (data: ResendVerificationDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/resend-code', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  forgotPassword: async (data: ForgotPasswordDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  resetPassword: async (data: ResetPasswordDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  changePassword: async (data: ChangePasswordDto): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/change-password', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/logout');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  refresh: async (): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.get<ProfileResponse>('/auth/profile');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProfile: async (data: UpdateUserDto): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.patch<ProfileResponse>('/auth/profile', data);
      return response.data;
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