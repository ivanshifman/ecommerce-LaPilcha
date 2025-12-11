import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  Profile as GoogleProfile,
  VerifyCallback,
} from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { OAuthUserDto } from '../dto/o-auth-user.dto';
import { AuthProvider } from '../../user/common/enums/authProvider.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    const options: StrategyOptions = {
      clientID: config.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackURL: config.get<string>('GOOGLE_CALLBACK') ?? '/auth/google/callback',
      scope: ['email', 'profile'],
    };

    super(options);
  }

  async validate(profile: GoogleProfile, done: VerifyCallback): Promise<void> {
    try {
      const dto: OAuthUserDto = {
        name: profile.displayName ?? profile.name?.givenName ?? 'Unknown',

        lastName: profile.name?.familyName,
        email: profile.emails?.[0]?.value ?? '',
        authProvider: AuthProvider.GOOGLE,
        providerId: profile.id,
        avatar: profile.photos?.[0]?.value,
      };

      const result = await this.authService.oauthLogin(dto);

      return done(null, result.user);
    } catch (err) {
      return done(err, undefined);
    }
  }
}
