import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { OAuthService } from './OAuth.service';
import { TokenService } from './token.service';
import { UserService } from '../user/user.service';
import { parseDurationToMs } from '../common/utils/parseDuration.util';
import { MailService } from '../common/mail/mail.service';
import { ACCESS_COOKIE, cookieOptions, REFRESH_COOKIE } from '../common/utils/cookie.util';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private userService: UserService,
    private mailService: MailService,
    private oAuthService: OAuthService,
    private tokenService: TokenService,
  ) {}

  async generateAndSaveVerificationCode(userId: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(
      Date.now() +
        parseDurationToMs(this.configService.get<string>('JWT_VERIFICATION_EXPIRATION') ?? '1h'),
    );
    await this.userModel.findByIdAndUpdate(userId, {
      emailVerificationCode: code,
      emailVerificationExpires: expires,
    });
    return { code, expires };
  }

  async verifyEmail(userId: string, code: string, res: Response) {
    const user = await this.verifyEmailCode(userId, code);
    const userDto = this.oAuthService.toDto(user);
    const tokens = await this.tokenService.createTokensForUser(userDto);
    res.cookie(ACCESS_COOKIE, tokens.accessToken, cookieOptions(this.configService, false));
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(this.configService, true));
    return userDto;
  }

  async verifyEmailCode(userId: string, code: string) {
    const user = await this.userModel
      .findById(userId)
      .select('+emailVerificationCode +emailVerificationExpires')
      .exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!user.emailVerificationCode || !user.emailVerificationExpires)
      throw new BadRequestException('No hay código de verificación activo');
    if (user.emailVerificationExpires < new Date())
      throw new BadRequestException('Código expirado');
    if (user.emailVerificationCode !== code) throw new BadRequestException('Código inválido');
    user.emailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    return user;
  }

  async resendVerificationCode(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('Usuario no encontrado');
    const { code } = await this.generateAndSaveVerificationCode(String(user._id));
    await this.mailService.sendVerificationCode(user.email, code);
  }
}
