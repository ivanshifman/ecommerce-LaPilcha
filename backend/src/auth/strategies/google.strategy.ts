import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { OAuthService } from '../oAuth.service';
import { ConfigService } from '@nestjs/config';
import { OAuthUserDto } from '../dto/o-auth-user.dto';
import { AuthProvider } from '../../user/common/enums/authProvider.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly OAuthService: OAuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: GoogleProfile) {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new Error('No se pudo obtener el email de Google. Verifica los permisos.');
    }

    if (!profile.id) {
      throw new Error('Error de autenticación con Google');
    }

    const givenName = profile.name?.givenName;
    const familyName = profile.name?.familyName;

    const name = givenName ?? profile.displayName?.split(' ')[0] ?? email.split('@')[0];
    const lastName = familyName ?? profile.displayName?.split(' ').slice(1).join(' ') ?? undefined;

    const dto: OAuthUserDto = {
      name,
      lastName,
      email,
      authProvider: AuthProvider.GOOGLE,
      providerId: profile.id,
      avatar: profile.photos?.[0]?.value,
    };

    const result = await this.OAuthService.oauthLogin(dto);

    return result.user;
  }
}
