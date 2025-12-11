import { UserRole } from '../../user/common/enums/userRole.enum';

export class AuthResponseDto {
  user: UserResponseDto = new UserResponseDto();
  accessToken!: string;
  refreshToken!: string;
}

export class UserResponseDto {
  id!: string;
  name!: string;
  lastName?: string;
  email!: string;
  role!: UserRole;
  emailVerified!: boolean;
  avatar?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProfileResponseDto extends UserResponseDto {
  wishlist: string[] = [];
  preferences?: {
    defaultSize?: string;
    favoriteColors?: string[];
  };
  totalOrders!: number;
  totalSpent!: number;
  lastLogin?: Date;
}

export class AdminUserResponseDto extends UserResponseDto {
  isActive!: boolean;
  lastLogin?: Date;
  totalOrders?: number;
  totalSpent?: number;
}
