import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import { cartService } from '../services/cart.service';
import { userService } from '../services/user.service';
import type {
    User,
    LoginDto,
    RegisterDto,
    UpdateUserDto,
    ProfileResponse
} from '../types/auth.types';
import { handleApiError } from '../api/error-handler';

interface AuthState {
    user: User | null;
    profile: ProfileResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    login: (data: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<{ userId: string; message: string }>;
    logout: () => Promise<void>;
    getProfile: () => Promise<void>;
    updateProfile: (data: UpdateUserDto) => Promise<void>;
    clearError: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            login: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(data);
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    try {
                        await cartService.mergeCart();
                    } catch (error) {
                        console.warn('Failed to merge cart:', error);
                    }

                    try {
                        await userService.getWishlist();
                    } catch (error) {
                        console.warn('Failed to load wishlist:', error);
                    }
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register(data);
                    set({ isLoading: false });
                    return {
                        userId: response.id,
                        message: response.message
                    };
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await authService.logout();
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false
                    });

                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('cart-storage');
                        localStorage.removeItem('wishlist-storage');
                        localStorage.removeItem('order-storage');
                    }
                } catch (error: unknown) {
                    const apiError = handleApiError(error);

                    set({
                        error: apiError.message,
                        isLoading: false
                    });

                    throw error;
                }
            },

            getProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const profile = await authService.getProfile();

                    set({
                        profile,
                        user: {
                            id: profile.id,
                            name: profile.name,
                            lastName: profile.lastName,
                            email: profile.email,
                            role: profile.role,
                            emailVerified: profile.emailVerified,
                            authProvider: profile.authProvider,
                            avatar: profile.avatar,
                            phone: profile.phone,
                            createdAt: profile.createdAt,
                            updatedAt: profile.updatedAt,
                            createdAtLocal: profile.createdAtLocal,
                            updatedAtLocal: profile.updatedAtLocal,
                        },
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    const apiError = handleApiError(error);
                    set({ error: apiError.message, isLoading: false });
                    throw error;
                }
            },


            updateProfile: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const updatedProfile = await authService.updateProfile(data);

                    set({
                        profile: updatedProfile,
                        user: {
                            id: updatedProfile.id,
                            name: updatedProfile.name,
                            lastName: updatedProfile.lastName,
                            email: updatedProfile.email,
                            role: updatedProfile.role,
                            emailVerified: updatedProfile.emailVerified,
                            authProvider: updatedProfile.authProvider,
                            avatar: updatedProfile.avatar,
                            phone: updatedProfile.phone,
                        },
                        isLoading: false,
                    });
                } catch (error) {
                    const apiError = handleApiError(error);
                    set({ error: apiError.message, isLoading: false });
                    throw error;
                }
            },


            clearError: () => set({ error: null }),

            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    await get().getProfile();
                } catch {
                    set({ user: null, profile: null, isAuthenticated: false });
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

export const useAuth = () => useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
}));

export const useAuthActions = () => useAuthStore((state) => ({
    login: state.login,
    register: state.register,
    logout: state.logout,
    getProfile: state.getProfile,
    updateProfile: state.updateProfile,
    clearError: state.clearError,
    checkAuth: state.checkAuth,
}));