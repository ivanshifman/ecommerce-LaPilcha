import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../user/schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { MailModule } from '../common/mail/mail.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';
import { EmailVerificationService } from './emailVerification.service';
import { OAuthService } from './oAuth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET') ?? 'fallback-secret',
      }),
    }),
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    PasswordService,
    EmailVerificationService,
    OAuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService, TokenService, PasswordService, EmailVerificationService, OAuthService],
})
export class AuthModule {}
