import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/create-user.dto';
import { UpdateUserAdminDto, UpdateUserDto } from './dto/update-user.dto';
import { AdminUserResponseDto, UserResponseDto } from '../auth/dto/auth-response.dto';
import { AuthProvider } from './common/enums/authProvider.enum';

@Injectable()
export class UserService {
  private saltRounds = 10;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createLocal(data: RegisterDto): Promise<UserDocument> {
    if (!data.password) {
      throw new BadRequestException('La contraseña es obligatoria para usuarios locales');
    }

    const hashed = await bcrypt.hash(data.password, this.saltRounds);

    const created = new this.userModel({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      password: hashed,
      phone: data.phone,
      authProvider: AuthProvider.LOCAL,
    });

    return created.save();
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
      if (!user.oauthProviders) user.oauthProviders = {};
      user.oauthProviders[key] = providerId;
      user.authProvider = provider === 'google' ? AuthProvider.GOOGLE : AuthProvider.APPLE;
      user.emailVerified = true;
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
    });
    return newUser.save();
  }

  async findByEmail(email: string) {
    return this.userModel
      .findOne({ email, deletedAt: { $exists: false } })
      .select('+password +refreshTokenHash +emailVerificationCode +emailVerificationExpires')
      .exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findAll() {
    return this.userModel.find({ deletedAt: { $exists: false } }).exec();
  }

  async setRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return this.userModel.findByIdAndUpdate(userId, { refreshTokenHash }, { new: true }).exec();
  }

  async update(userId: string, dto: UpdateUserDto): Promise<UserDocument> {
    const updated = await this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return updated;
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

  async findByIdAsDto(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.toUserResponseDto(user);
  }

  async delete(id: string): Promise<UserDocument> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Usuario no encontrado');
    return result;
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

  async findByResetToken(token: string) {
    return this.userModel.findOne({ resetPasswordToken: token }).exec();
  }
}
