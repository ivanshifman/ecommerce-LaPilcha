import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { MailService } from '../common/mail/mail.service';
import { parseDurationToMs } from '../common/utils/parseDuration.util';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/update-password.dto';

@Injectable()
export class PasswordService {
  private saltRounds = 10;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async validatePassword(user: UserDocument, password: string) {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userService.findByIdWithPassword(userId);
    if (!user) throw new BadRequestException('Usuario no encontrado');

    const ok = await this.validatePassword(user, dto.currentPassword);
    if (!ok) throw new BadRequestException('Contraseña actual incorrecta');

    const isSamePassword = await this.validatePassword(user, dto.newPassword);
    if (isSamePassword) {
      throw new BadRequestException('La nueva contraseña debe ser diferente a la actual');
    }

    const newHash = await this.hashPassword(dto.newPassword);

    await this.userService.updatePassword(userId, newHash);
    await this.userService.setRefreshTokenHash(userId, null);

    return { message: 'Contraseña cambiada exitosamente' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      return {
        message: 'Si el email está registrado, recibirás instrucciones para resetear tu contraseña',
      };
    }

    const payload = { sub: String(user._id), email: user.email, role: user.role };
    const token = await this.tokenService.signVerificationToken(payload);

    const expires = new Date(
      Date.now() +
        parseDurationToMs(this.configService.get<string>('JWT_VERIFICATION_EXPIRATION') ?? '1h'),
    );

    await this.userService.setResetToken(String(user._id), token, expires);
    await this.mailService.sendResetPasswordEmail(dto.email, token);

    return {
      message: 'Si el email está registrado, recibirás instrucciones para resetear tu contraseña',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userService.findByResetToken(dto.token);

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    if (user.password) {
      const isSamePassword = await this.validatePassword(user, dto.newPassword);
      if (isSamePassword) {
        throw new BadRequestException('La nueva contraseña debe ser diferente a la actual');
      }
    }

    const hashed = await this.hashPassword(dto.newPassword);

    await this.userService.updatePasswordAndClearReset(String(user._id), hashed);
    await this.userService.setRefreshTokenHash(String(user._id), null);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
