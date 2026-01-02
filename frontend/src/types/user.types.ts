import { UserRole } from './auth.types';

export interface AdminUserResponse {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  authProvider: string;
  totalOrders: number;
  totalSpent: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface UpdateUserAdminDto {
  name?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}