import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  BadRequestException,
  Patch,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SkipApiResponse } from '../common/decorators/skip-api-response.decorator';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './emailVerification.service';
import { PasswordService } from './password.service';
import { CartService } from '../cart/cart.service';
import { CART_COOKIE, REFRESH_COOKIE } from '../common/utils/cookie.util';
import { getCookie } from '../common/utils/request.util';
import { RegisterDto } from '../user/dto/create-user.dto';
import { RegisterResponseDto } from '../user/dto/register-response.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/update-password.dto';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { AuthResponseDto, ProfileResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { GetUserIdDto } from './dto/get-user-id.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return await this.authService.registerLocal(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const user = req.user as AuthenticatedUserDto;
    const anonymousCartId = getCookie(req, CART_COOKIE);

    if (anonymousCartId) {
      try {
        await this.cartService.mergeAnonymousCart(user.id, anonymousCartId, res);
      } catch (error) {
        if (this.configService.get('NODE_ENV') !== 'production') {
          console.error('Error al fusionar carritos:', error);
        }
      }
    }
    return await this.authService.loginLocal(user, res);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as AuthenticatedUserDto;
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    try {
      const anonymousCartId = getCookie(req, CART_COOKIE);
      if (anonymousCartId) {
        await this.cartService.mergeAnonymousCart(user.id, anonymousCartId, res);
      }

      await this.authService.loginOAuth(user, res);

      return res.redirect(`${frontendUrl}/?auth=success`);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return res.redirect(`${frontendUrl}/?auth=error`);
    }
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  appleAuth() {}

  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as AuthenticatedUserDto;
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    try {
      const anonymousCartId = getCookie(req, CART_COOKIE);
      if (anonymousCartId) {
        await this.cartService.mergeAnonymousCart(user.id, anonymousCartId, res);
      }

      await this.authService.loginOAuth(user, res);

      return res.redirect(`${frontendUrl}/?auth=success`);
    } catch (error) {
      console.error('Apple OAuth error:', error);
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto, @Res({ passthrough: true }) res: Response) {
    const userDto = await this.emailVerificationService.verifyEmail(dto.userId, dto.code);
    if (!userDto) throw new BadRequestException('Verificación fallida');
    return await this.authService.loginLocal(userDto, res);
  }

  @Post('resend-code')
  async resend(@Body() dto: ResendVerificationDto) {
    return await this.emailVerificationService.resendVerificationCode(dto.userId);
  }

  @Post('forgot-password')
  async forgot(@Body() body: ForgotPasswordDto) {
    return await this.passwordService.forgotPassword(body);
  }

  @Post('reset-password')
  async reset(@Body() body: ResetPasswordDto) {
    return await this.passwordService.resetPassword(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async change(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.passwordService.changePassword(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as AuthenticatedUserDto;
    return await this.authService.logout(user.id, res);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!refresh) throw new BadRequestException('No refresh token');
    return await this.authService.refreshTokensFromCookie(refresh, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateUser(@Req() req: Request, @Body() dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = req.user as AuthenticatedUserDto;
    return await this.authService.updateUser(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request): Promise<ProfileResponseDto> {
    const user = req.user as AuthenticatedUserDto;
    return await this.authService.profile(user);
  }

  @Post('get-user-id')
  @SkipApiResponse()
  async getUserIdByEmail(@Body() dto: GetUserIdDto): Promise<{ userId: string }> {
    const user = await this.authService.getUserIdByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return { userId: String(user._id) };
  }
}
