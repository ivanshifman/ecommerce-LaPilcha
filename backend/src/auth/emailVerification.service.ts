import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { MailService } from '../common/mail/mail.service';
import { parseDurationToMs } from '../common/utils/parseDuration.util';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { UserMapper } from '../common/mappers/user.mapper';
import { AuthProvider } from '../user/common/enums/authProvider.enum';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private userService: UserService,
    private mailService: MailService,
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

  async verifyEmail(userId: string, code: string): Promise<AuthenticatedUserDto> {
    const user = await this.verifyEmailCode(userId, code);
    return UserMapper.toAuthenticatedDto(user);
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

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.isActive) {
      throw new BadRequestException('Usuario desactivado');
    }

    if (user.emailVerified) {
      throw new BadRequestException('El email ya ha sido verificado');
    }

    if (user.authProvider !== AuthProvider.LOCAL) {
      throw new BadRequestException('Los usuarios OAuth no requieren verificación de email');
    }

    const { code } = await this.generateAndSaveVerificationCode(String(user._id));
    await this.mailService.sendVerificationCode(user.email, code);

    return { message: 'Código de verificación enviado exitosamente' };
  }
}
