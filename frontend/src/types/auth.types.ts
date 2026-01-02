export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
  emailVerified: boolean;
  avatar?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  createdAtLocal?: string;
  updatedAtLocal?: string;
}

export interface RegisterDto {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyEmailDto {
  userId: string;
  code: string;
}

export interface ResendVerificationDto {
  userId: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserDto {
  name?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  preferences?: {
    defaultSize?: string;
    favoriteColors?: string[];
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse extends User {
  message: string;
}

export interface ProfileResponse extends User {
  wishlist: string[];
  preferences?: {
    defaultSize?: string;
    favoriteColors?: string[];
  };
  totalOrders: number;
  totalSpent: number;
  lastLogin?: string;
  lastLoginLocal?: string;
}

export interface AdminUserResponseDto extends User {
  isActive: boolean;
  lastLogin?: Date;
  totalOrders?: number;
  totalSpent?: number;
}