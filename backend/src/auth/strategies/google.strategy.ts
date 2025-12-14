import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  Profile as GoogleProfile,
  VerifyCallback,
} from 'passport-google-oauth20';
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
    const options: StrategyOptions = {
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK') ?? '/auth/google/callback',
      scope: ['email', 'profile'],
    };

    super(options);
  }

  async validate(profile: GoogleProfile, done: VerifyCallback): Promise<void> {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(
          new Error(
            'No se pudo obtener el email de Google. Verifica los permisos de la aplicación.',
          ),
          undefined,
        );
      }

      if (!profile.id) {
        return done(new Error('Error de autenticación con Google'), undefined);
      }

      let name = profile.displayName;
      if (!name && profile.name?.givenName) {
        name = profile.name.givenName;
      }
      if (!name) {
        name = email.split('@')[0];
      }

      const dto: OAuthUserDto = {
        name,
        lastName: profile.name?.familyName,
        email,
        authProvider: AuthProvider.GOOGLE,
        providerId: profile.id,
        avatar: profile.photos?.[0]?.value,
      };

      const result = await this.OAuthService.oauthLogin(dto);

      return done(null, result.user);
    } catch (err) {
      return done(err, undefined);
    }
  }
}
