import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { MailService } from '../common/mail/mail.service';
import { TokensUtil } from '../common/utils/tokens.util';
import { RegisterDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { OAuthUserDto } from './dto/o-auth-user.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/update-password';
import { AuthProvider } from '../user/common/enums/authProvider.enum';
import { AuthTokens } from './types/auth-tokens.type';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { Response } from 'express';
import { ACCESS_COOKIE, cookieOptions, REFRESH_COOKIE } from '../common/utils/cookie.util';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserDocument } from '../user/schemas/user.schema';
import { AuthResponseDto, ProfileResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from 'src/user/dto/register-response.dto';

@Injectable()
export class AuthService {
  private tokensUtil: TokensUtil;
  private saltRounds = 10;

  constructor(
    private users: UserService,
    private config: ConfigService,
    private mail: MailService,
    private jwtService: JwtService,
  ) {
    this.tokensUtil = new TokensUtil(this.config, this.jwtService);
  }

  async registerLocal(dto: RegisterDto): Promise<RegisterResponseDto> {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email ya registrado');

    const user = await this.users.createLocal(dto);
    const { code } = await this.users.generateAndSaveVerificationCode(String(user._id));

    await this.mail.sendVerificationCode(user.email, code);

    return {
      id: user._id.toString(),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.emailVerified,
      message: 'Registro exitoso. Por favor verifica tu email.',
    };
  }

  async validateUser(dto: LoginUserDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) return null;
    if (user.authProvider && user.authProvider !== AuthProvider.LOCAL) return null;
    const ok = await this.users.validatePassword(user, dto.password);
    if (!ok) return null;

    return user;
  }

  async updateUser(user: AuthenticatedUserDto, dto: UpdateUserDto): Promise<UserResponseDto> {
    const updated = await this.users.update(user.id, dto);
    return this.toUserResponseDto(updated);
  }

  private async createTokensForUser(user: AuthenticatedUserDto): Promise<AuthTokens> {
    const payload = {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.tokensUtil.signAccessToken(payload);
    const refreshToken = await this.tokensUtil.signRefreshToken(payload);

    const refreshHash = await bcrypt.hash(refreshToken, this.saltRounds);
    await this.users.setRefreshTokenHash(String(user.id), refreshHash);

    return {
      accessToken,
      refreshToken,
    };
  }

  async loginLocal(user: AuthenticatedUserDto, res: Response): Promise<AuthResponseDto> {
    if (!user.emailVerified) {
      throw new UnauthorizedException('Email no verificado');
    }

    const tokens = await this.createTokensForUser(user);

    res.cookie(ACCESS_COOKIE, tokens.accessToken, cookieOptions(this.config, false));
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(this.config, true));

    const userDoc = await this.users.findById(user.id);
    if (!userDoc) throw new NotFoundException('Usuario no encontrado');

    return {
      user: this.toUserResponseDto(userDoc),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
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

  toDto(user: UserDocument): AuthenticatedUserDto {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  }

  async oauthLogin(dto: OAuthUserDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing && existing.authProvider !== dto.authProvider) {
      throw new BadRequestException(`Email ya registrado con ${existing.authProvider}`);
    }

    const user = await this.users.createOAuthUser({
      provider: dto.authProvider,
      providerId: dto.providerId,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
    });

    const userDto = this.toDto(user);
    const tokens = await this.createTokensForUser(userDto);

    return { user: userDto, ...tokens };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.users.findById(userId);
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Invalid session');

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) throw new ForbiddenException('Invalid refresh token');

    const userDto = this.toDto(user);
    const tokens = await this.createTokensForUser(userDto);
    return tokens;
  }

  async logout(userId: string, res: Response) {
    await this.users.setRefreshTokenHash(userId, null);
    res.clearCookie(ACCESS_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_COOKIE, { path: '/auth/refresh' });
    return { message: 'Sesión cerrada' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) return;

    const payload = { sub: String(user._id), email: user.email };
    const token = await this.tokensUtil.signVerificationToken(payload);

    const expires = new Date(
      Date.now() +
        parseDurationToMs(this.config.get<string>('JWT_VERIFICATION_EXPIRATION') ?? '1h'),
    );

    await this.users.setResetToken(String(user._id), token, expires);
    await this.mail.sendResetPasswordEmail(dto.email, token);
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      await this.tokensUtil.verifyToken(dto.token);
    } catch {
      throw new BadRequestException('Token inválido o expirado');
    }

    const user = await this.users.findByResetToken(dto.token);
    if (
      !user ||
      user.resetPasswordToken !== dto.token ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const hashed = await bcrypt.hash(dto.newPassword, this.saltRounds);

    await this.users.updatePasswordAndClearReset(String(user._id), hashed);
    await this.users.setRefreshTokenHash(String(user._id), null);
    return { message: 'Contraseña actualizada exitosamente' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.users.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    const ok = await this.users.validatePassword(user, dto.currentPassword);
    if (!ok) throw new BadRequestException('Contraseña actual incorrecta');

    const newHash = await bcrypt.hash(dto.newPassword, this.saltRounds);
    await this.users.updatePassword(userId, newHash);
    await this.users.setRefreshTokenHash(userId, null);
    return { message: 'Contraseña cambiada exitosamente' };
  }

  async verifyEmail(userId: string, code: string, res: Response) {
    const user = await this.users.verifyEmailCode(userId, code);

    const userDto = this.toDto(user);

    const tokens = await this.createTokensForUser(userDto);
    res.cookie(ACCESS_COOKIE, tokens.accessToken, cookieOptions(this.config, false));
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(this.config, true));

    return userDto;
  }

  async resendVerificationCode(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new BadRequestException('Usuario no encontrado');
    const { code } = await this.users.generateAndSaveVerificationCode(String(user._id));
    await this.mail.sendVerificationCode(user.email, code);
  }

  async refreshTokensFromCookie(
    refreshToken: string,
    res: Response,
  ): Promise<AuthTokens & { user: AuthenticatedUserDto }> {
    const payload = await this.tokensUtil.verifyToken(refreshToken);
    const userId = payload.sub;

    const tokens = await this.refreshTokens(userId, refreshToken);

    const userDoc = await this.users.findById(userId);
    if (!userDoc) throw new UnauthorizedException('Usuario no encontrado');

    res.cookie(ACCESS_COOKIE, tokens.accessToken, cookieOptions(this.config, false));
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(this.config, true));

    const user: AuthenticatedUserDto = {
      id: String(userDoc._id),
      email: userDoc.email,
      role: userDoc.role,
    };

    return { ...tokens, user };
  }

  async profile(user: AuthenticatedUserDto): Promise<ProfileResponseDto> {
    const userDoc = await this.users.findById(user.id);
    if (!userDoc) throw new NotFoundException('Usuario no encontrado');

    return {
      ...this.toUserResponseDto(userDoc),
      wishlist: userDoc.wishlist.map((id) => id.toString()),
      preferences: userDoc.preferences,
      totalOrders: userDoc.totalOrders,
      totalSpent: userDoc.totalSpent,
      lastLogin: userDoc.lastLogin,
    };
  }
}

function parseDurationToMs(str: string) {
  const num = parseInt(str.slice(0, -1), 10);
  const unit = str.slice(-1);
  switch (unit) {
    case 's':
      return num * 1000;
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    default:
      return num * 1000;
  }
}
