import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as AppleStrategyPkg from 'passport-apple';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { OAuthUserDto } from '../dto/o-auth-user.dto';
import { AuthProvider } from '../../user/common/enums/authProvider.enum';

const AppleOAuthStrategy = AppleStrategyPkg.Strategy;
interface AppleProfile {
  id?: string;
  sub?: string;
  email?: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
}

@Injectable()
export class AppleStrategy extends PassportStrategy(AppleOAuthStrategy, 'apple') {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super({
      clientID: config.get<string>('APPLE_CLIENT_ID'),
      teamID: config.get<string>('APPLE_TEAM_ID'),
      keyID: config.get<string>('APPLE_KEY_ID'),
      privateKey: config.get<string>('APPLE_PRIVATE_KEY'),
      callbackURL: config.get<string>('APPLE_CALLBACK') || '/auth/apple/callback',
      scope: ['name', 'email'],
    } as any);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: AppleProfile,
    done: (err: unknown, user?: unknown) => void,
  ) {
    try {
      const firstName = profile.name?.firstName ?? '';
      const lastName = profile.name?.lastName ?? '';
      const dto: OAuthUserDto = {
        name: firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Apple user',
        lastName: lastName || undefined,
        email: profile.email ?? 'no-email@apple.com',
        authProvider: AuthProvider.APPLE,
        providerId: profile.id ?? profile.sub ?? 'unknown',
        avatar: undefined,
      };

      const result = await this.authService.oauthLogin(dto);

      return done(null, result.user);
    } catch (err) {
      return done(err, false);
    }
  }
}
