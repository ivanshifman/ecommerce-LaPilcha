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
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from '../user/dto/create-user.dto';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/update-password';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { REFRESH_COOKIE } from '../common/utils/cookie.util';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.auth.registerLocal(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as AuthenticatedUserDto;
    return await this.auth.loginLocal(user, res);
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() body: { userId: string; code: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const userDto = await this.auth.verifyEmail(body.userId, body.code, res);
    if (!userDto) throw new BadRequestException('Verificación fallida');

    return await this.auth.loginLocal(userDto, res);
  }

  @Post('resend-code')
  async resend(@Body() body: { userId: string }) {
    return await this.auth.resendVerificationCode(body.userId);
  }

  @Post('forgot-password')
  async forgot(@Body() body: ForgotPasswordDto) {
    return await this.auth.forgotPassword(body);
  }

  @Post('reset-password')
  async reset(@Body() body: ResetPasswordDto) {
    return await this.auth.resetPassword(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async change(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.auth.changePassword(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as AuthenticatedUserDto;
    return await this.auth.logout(user.id, res);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!refresh) throw new BadRequestException('No refresh token');
    return await this.auth.refreshTokensFromCookie(refresh, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateUser(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.auth.updateUser(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    return await this.auth.profile(req.user as AuthenticatedUserDto);
  }
}
