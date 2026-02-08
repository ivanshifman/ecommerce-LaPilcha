import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { authService } from '../services/auth.service';
import { scheduleTokenRefresh, clearTokenRefresh } from '../lib/auth/tokenRefresh';
import type {
  User,
  LoginDto,
  RegisterDto,
  UpdateUserDto,
  ProfileResponse,
} from '../types/auth.types';
import { handleApiError } from '../api/error-handler';
import { useCartStore } from './cartStore';

interface AuthState {
  user: User | null;
  profile: ProfileResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<{ userId: string; message: string }>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (data: UpdateUserDto) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });

      if (response.expiresIn) {
        scheduleTokenRefresh(response.expiresIn);
      } else {
        scheduleTokenRefresh();
      }
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      set({ isLoading: false });
      return { userId: response.id, message: response.message };
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      clearTokenRefresh();
      await authService.logout();
      useCartStore.setState({ cart: null });
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const profile = await authService.getProfile();
      set({
        profile,
        user: profile,
        isAuthenticated: true,
        isLoading: false,
      });

      scheduleTokenRefresh();
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authService.updateProfile(data);
      set({ profile, user: profile, isLoading: false });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });

    try {
      await get().getProfile();
    } catch {
      clearTokenRefresh();
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export const useAuth = () =>
  useAuthStore(
    useShallow((state) => ({
      user: state.user,
      profile: state.profile,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
    }))
  );

export const useAuthActions = () => useAuthStore(
  useShallow((state) => ({
    login: state.login,
    register: state.register,
    logout: state.logout,
    getProfile: state.getProfile,
    updateProfile: state.updateProfile,
    clearError: state.clearError,
    checkAuth: state.checkAuth,
  }))
);