import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserAdminDto, UpdateUserDto } from './dto/update-user.dto';
import { AdminUserResponseDto, UserResponseDto } from '../auth/dto/auth-response.dto';
import { AuthProvider } from './common/enums/authProvider.enum';
import { UserMapper } from '../common/mappers/user.mapper';

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
    lastName?: string;
    provider: AuthProvider.GOOGLE | AuthProvider.APPLE;
    providerId: string;
    avatar?: string;
  }): Promise<UserResponseDto> {
    const { email, provider, providerId, name, lastName, avatar } = payload;

    const oauthKey = provider === AuthProvider.GOOGLE ? 'google' : 'apple';

    const newUser = new this.userModel({
      name,
      lastName,
      email,
      avatar,
      authProvider: provider,
      emailVerified: true,
      oauthProviders: {
        [oauthKey]: providerId,
      },
      lastLogin: new Date(),
    });

    const saved = await newUser.save();
    return this.toUserResponseDto(saved);
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
    return UserMapper.toUserResponseDto(doc);
  }

  private toAdminUserResponseDto(doc: UserDocument): AdminUserResponseDto {
    return UserMapper.toAdminUserResponseDto(doc);
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

  async findByIdWithPassword(id: string) {
    return this.userModel.findById(id).select('+password').exec();
  }

  async findAll() {
    return this.userModel.find({ deletedAt: { $exists: false } }).exec();
  }

  async findAllAsDto(): Promise<AdminUserResponseDto[]> {
    const users = await this.userModel.find({ deletedAt: { $exists: false } }).exec();
    return users.map((user) => this.toAdminUserResponseDto(user));
  }

  async findByResetToken(token: string) {
    return this.userModel
      .findOne({ resetPasswordToken: token })
      .select('+password +resetPasswordToken +resetPasswordExpires')
      .exec();
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
