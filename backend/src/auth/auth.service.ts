import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { UserService } from '../user/user.service';
import { WishlistService } from '../user/wishList.service';
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
import {
  ACCESS_COOKIE,
  CART_COOKIE,
  cookieOptions,
  REFRESH_COOKIE,
  WISHLIST_COOKIE,
} from '../common/utils/cookie.util';
import { UserMapper } from '../common/mappers/user.mapper';

@Injectable()
export class AuthService {
  private tokensUtil: TokensUtil;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly wishlistService: WishlistService,
  ) {
    this.tokensUtil = new TokensUtil(this.configService, this.jwtService);
  }

  async registerLocal(dto: RegisterDto): Promise<RegisterResponseDto> {
    const exists = await this.userService.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email ya registrado');

    if (!dto.password) {
      throw new BadRequestException('La contraseña es obligatoria para usuarios locales');
    }

    const hashedPassword = await this.passwordService.hashPassword(dto.password);

    const user = await this.userService.create({
      name: dto.name,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      authProvider: AuthProvider.LOCAL,
    });

    const { code } = await this.emailVerificationService.generateAndSaveVerificationCode(user.id);

    await this.mailService.sendVerificationCode(user.email, code);

    return {
      message: 'Registro exitoso. Por favor verifica tu email.',
      ...user,
    };
  }

  async validateUser(dto: LoginUserDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) return null;

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    if (user.authProvider && user.authProvider !== AuthProvider.LOCAL) return null;
    const ok = await this.passwordService.validatePassword(user, dto.password);
    if (!ok) return null;
    return user;
  }

  async updateUser(user: AuthenticatedUserDto, dto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.update(user.id, dto);
  }

  private async finalizeLogin(user: AuthenticatedUserDto, res: Response): Promise<AuthResponseDto> {
    const tokens = await this.tokenService.createTokensForUser(user);

    res.cookie(ACCESS_COOKIE, tokens.accessToken, cookieOptions(this.configService, false));
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(this.configService, true));

    const userDoc = await this.userService.findById(user.id);
    if (!userDoc) throw new UnauthorizedException('Usuario no encontrado');

    userDoc.lastLogin = new Date();
    await userDoc.save();

    const req = res.req as Request | undefined;
    if (req?.cookies?.[WISHLIST_COOKIE]) {
      try {
        await this.wishlistService.mergeAnonymousWishlist(user.id, req, res);
      } catch (error) {
        if (this.configService.get('NODE_ENV') !== 'production') {
          console.error('Error merging wishlist:', error);
        }
      }
    }

    return {
      user: UserMapper.toUserResponseDto(userDoc),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async loginLocal(user: AuthenticatedUserDto, res: Response): Promise<AuthResponseDto> {
    if (!user.emailVerified) {
      throw new UnauthorizedException('Email no verificado');
    }

    return this.finalizeLogin(user, res);
  }

  async loginOAuth(user: AuthenticatedUserDto, res: Response): Promise<AuthResponseDto> {
    return this.finalizeLogin(user, res);
  }

  async logout(userId: string, res: Response) {
    await this.userService.setRefreshTokenHash(userId, null);
    res.clearCookie(ACCESS_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_COOKIE, { path: '/auth/refresh' });
    res.clearCookie(CART_COOKIE, { path: '/' });
    res.clearCookie(WISHLIST_COOKIE, { path: '/' });
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
    return UserMapper.toProfileResponseDto(userDoc);
  }

  async getUserIdByEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      console.error('❌ User not found in database');
      return null;
    }

    return user;
  }
}
