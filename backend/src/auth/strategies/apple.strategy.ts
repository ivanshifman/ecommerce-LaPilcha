import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as AppleStrategyPkg from 'passport-apple';
import { OAuthService } from '../oAuth.service';
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
    private OAuthService: OAuthService,
    private configService: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      keyID: configService.get<string>('APPLE_KEY_ID'),
      privateKey: configService.get<string>('APPLE_PRIVATE_KEY'),
      callbackURL: configService.get<string>('APPLE_CALLBACK') || '/auth/apple/callback',
      scope: ['name', 'email'],
      passReqToCallback: false,
    } as any);
  }

  async validate(_accessToken: string, _refreshToken: string, profile: AppleProfile) {
    const email = profile.email;
    if (!email) {
      throw new Error(
        'Se requiere acceso al email. Por favor permite el acceso al email en Apple.',
      );
    }

    const providerId = profile.sub ?? profile.id;
    if (!providerId) {
      throw new Error('Error de autenticación con Apple. Intenta de nuevo.');
    }

    const firstName = profile.name?.firstName ?? '';
    const lastName = profile.name?.lastName ?? '';

    const name = firstName || lastName ? `${firstName} ${lastName}`.trim() : email.split('@')[0];

    const dto: OAuthUserDto = {
      name,
      lastName: lastName || undefined,
      email,
      authProvider: AuthProvider.APPLE,
      providerId,
      avatar: undefined,
    };

    const result = await this.OAuthService.oauthLogin(dto);

    return result.user;
  }
}
