import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserAdminDto, UpdateUserDto } from './dto/update-user.dto';
import { AdminUserResponseDto, UserResponseDto } from '../auth/dto/auth-response.dto';
import { AuthProvider } from './common/enums/authProvider.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: {
    name: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
    authProvider: AuthProvider;
  }): Promise<UserResponseDto> {
    const created = new this.userModel(data);
    const saved = await created.save();
    return this.toUserResponseDto(saved);
  }

  async createOAuthUser(payload: {
    name: string;
    email: string;
    provider: string;
    providerId: string;
    avatar?: string;
  }) {
    const { email, provider, providerId, name, avatar } = payload;
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      const key = provider as 'google' | 'apple';

      if (user.authProvider === AuthProvider.LOCAL) {
        throw new BadRequestException(
          'Esta cuenta fue creada con email y contraseña. Por favor inicia sesión con tu contraseña.',
        );
      }

      if (user.oauthProviders?.[key] && user.oauthProviders[key] !== providerId) {
        throw new BadRequestException(`Esta cuenta ya está vinculada a otra cuenta de ${provider}`);
      }

      if (!user.oauthProviders) user.oauthProviders = {};
      user.oauthProviders[key] = providerId;
      user.authProvider = provider === 'google' ? AuthProvider.GOOGLE : AuthProvider.APPLE;
      user.emailVerified = true;
      user.lastLogin = new Date();
      await user.save();
      return user;
    }
    const newUser = new this.userModel({
      name,
      email,
      avatar,
      authProvider: provider === 'google' ? 'google' : 'apple',
      emailVerified: true,
      oauthProviders: { [provider]: providerId },
      lastLogin: new Date(),
    });
    return newUser.save();
  }

  async setRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return this.userModel.findByIdAndUpdate(userId, { refreshTokenHash }, { new: true }).exec();
  }

  async updateUserAdmin(userId: string, dto: UpdateUserAdminDto): Promise<AdminUserResponseDto> {
    const updatedDoc = await this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
    if (!updatedDoc) throw new NotFoundException('Usuario no encontrado');
    return this.toAdminUserResponseDto(updatedDoc);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const result = await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
    if (!result) throw new NotFoundException('Usuario no encontrado');
  }

  async updatePasswordAndClearReset(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  async incrementOrders(userId: string, amount = 1) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { totalOrders: amount } },
      { new: true },
    );
  }

  async clearVerification(userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { emailVerificationCode: null, emailVerificationExpires: null },
      { new: true },
    );
  }

  async setResetToken(userId: string, token: string, expires: Date) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { resetPasswordToken: token, resetPasswordExpires: expires },
      { new: true },
    );
  }

  private toUserResponseDto(doc: UserDocument): UserResponseDto {
    return {
      id: doc._id.toString(),
      name: doc.name,
      lastName: doc.lastName,
      email: doc.email,
      role: doc.role,
      emailVerified: doc.emailVerified,
      avatar: doc.avatar,
      phone: doc.phone,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private toAdminUserResponseDto(doc: UserDocument): AdminUserResponseDto {
    return {
      ...this.toUserResponseDto(doc),
      isActive: doc.isActive,
      lastLogin: doc.lastLogin,
      totalOrders: doc.totalOrders,
      totalSpent: doc.totalSpent,
    };
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByIdAsDto(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.toUserResponseDto(user);
  }

  async findByEmail(email: string) {
    return this.userModel
      .findOne({ email, deletedAt: { $exists: false } })
      .select('+password +refreshTokenHash +emailVerificationCode +emailVerificationExpires')
      .exec();
  }

  async findAll() {
    return this.userModel.find({ deletedAt: { $exists: false } }).exec();
  }

  async findAllAsDto(): Promise<AdminUserResponseDto[]> {
    const users = await this.userModel.find({ deletedAt: { $exists: false } }).exec();
    return users.map((user) => this.toAdminUserResponseDto(user));
  }

  async findByResetToken(token: string) {
    return this.userModel.findOne({ resetPasswordToken: token }).exec();
  }

  async update(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const updated = await this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();

    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.toUserResponseDto(updated);
  }

  async delete(id: string): Promise<AdminUserResponseDto> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        isActive: false,
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.toAdminUserResponseDto(user);
  }
}
