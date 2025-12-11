import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserDocument } from '../user/schemas/user.schema';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { UserService } from '../user/user.service';
import { MailService } from '../common/mail/mail.service';
import { EmailVerificationService } from '../auth/emailVerification.service';
import { TokensUtil } from '../common/utils/tokens.util';
import { RegisterDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { AuthResponseDto, ProfileResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from '../user/dto/register-response.dto';
import { AuthProvider } from '../user/common/enums/authProvider.enum';
import { AuthTokens } from './types/auth-tokens.type';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { ACCESS_COOKIE, cookieOptions, REFRESH_COOKIE } from '../common/utils/cookie.util';

@Injectable()
export class AuthService {
  private tokensUtil: TokensUtil;

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private mailService: MailService,
    private emailVerificationService: EmailVerificationService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private tokenService: TokenService,
  ) {
    this.tokensUtil = new TokensUtil(this.configService, this.jwtService);
  }

  async registerLocal(dto: RegisterDto): Promise<RegisterResponseDto> {
    const exists = await this.userService.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email ya registrado');

    const user = await this.userService.createLocal(dto);
    const { code } = await this.emailVerificationService.generateAndSaveVerificationCode(
      String(user._id),
    );

    await this.mailService.sendVerificationCode(user.email, code);

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
    const user = await this.userService.findByEmail(dto.email);
    if (!user) return null;
    if (user.authProvider && user.authProvider !== AuthProvider.LOCAL) return null;
    const ok = await this.passwordService.validatePassword(user, dto.password);
    if (!ok) return null;
    return user;
  }

  async updateUser(user: AuthenticatedUserDto, dto: UpdateUserDto): Promise<UserResponseDto> {
    const updated = await this.userService.update(user.id, dto);
    return this.toUserResponseDto(updated);
  }

  async loginLocal(user: AuthenticatedUserDto, res: Response): Promise<AuthResponseDto> {
    if (!user.emailVerified) {
      throw new UnauthorizedException('Email no verificado');
    }

    const tokens = await this.tokenService.createTokensForUser(user);

    res.cookie(ACCESS_COOKIE, tokens.accessToken, cookieOptions(this.configService, false));
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(this.configService, true));

    const userDoc = await this.userService.findById(user.id);
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

  async logout(userId: string, res: Response) {
    await this.userService.setRefreshTokenHash(userId, null);
    res.clearCookie(ACCESS_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_COOKIE, { path: '/auth/refresh' });
    return { message: 'Sesión cerrada' };
  }

  async refreshTokensFromCookie(
    refreshToken: string,
    res: Response,
  ): Promise<AuthTokens & { user: AuthenticatedUserDto }> {
    const payload = await this.tokensUtil.verifyToken(refreshToken);
    const userId = payload.sub;
    const tokens = await this.tokenService.refreshTokens(userId, refreshToken);
    const userDoc = await this.userService.findById(userId);
    if (!userDoc) throw new UnauthorizedException('Usuario no encontrado');

    res.cookie(ACCESS_COOKIE, tokens.accessToken, cookieOptions(this.configService, false));
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(this.configService, true));

    const user: AuthenticatedUserDto = {
      id: String(userDoc._id),
      email: userDoc.email,
      role: userDoc.role,
    };

    return { ...tokens, user };
  }

  async profile(user: AuthenticatedUserDto): Promise<ProfileResponseDto> {
    const userDoc = await this.userService.findById(user.id);
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
