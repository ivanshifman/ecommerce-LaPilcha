import { UserDocument } from '../../user/schemas/user.schema';
import { AuthenticatedUserDto } from '../../auth/dto/authenticated-user.dto';
import {
  AdminUserResponseDto,
  ProfileResponseDto,
  UserResponseDto,
} from '../../auth/dto/auth-response.dto';

export class UserMapper {
  static toAuthenticatedDto(user: UserDocument): AuthenticatedUserDto {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  }

  static toUserResponseDto(user: UserDocument): UserResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      avatar: user.avatar,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toAdminUserResponseDto(doc: UserDocument): AdminUserResponseDto {
    return {
      ...this.toUserResponseDto(doc),
      isActive: doc.isActive,
      lastLogin: doc.lastLogin,
      totalOrders: doc.totalOrders,
      totalSpent: doc.totalSpent,
    };
  }

  static toProfileResponseDto(user: UserDocument): ProfileResponseDto {
    return {
      ...this.toUserResponseDto(user),
      wishlist: user.wishlist.map((id) => id.toString()),
      preferences: user.preferences,
      totalOrders: user.totalOrders,
      totalSpent: user.totalSpent,
      lastLogin: user.lastLogin,
    };
  }
}
