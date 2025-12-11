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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './emailVerification.service';
import { PasswordService } from './password.service';
import { REFRESH_COOKIE } from '../common/utils/cookie.util';
import { RegisterDto } from '../user/dto/create-user.dto';
import { RegisterResponseDto } from '../user/dto/register-response.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/update-password.dto';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { AuthResponseDto, ProfileResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
    private passwordService: PasswordService,
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
    return await this.authService.loginLocal(user, res);
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() body: { userId: string; code: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const userDto = await this.emailVerificationService.verifyEmail(body.userId, body.code, res);
    if (!userDto) throw new BadRequestException('Verificación fallida');

    return await this.authService.loginLocal(userDto, res);
  }

  @Post('resend-code')
  async resend(@Body() body: { userId: string }) {
    return await this.emailVerificationService.resendVerificationCode(body.userId);
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
}
