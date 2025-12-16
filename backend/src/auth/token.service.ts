import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { TokensUtil } from '../common/utils/tokens.util';
import { ACCESS_COOKIE, cookieOptions, REFRESH_COOKIE } from '../common/utils/cookie.util';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { AuthTokens } from './types/auth-tokens.type';
import { UserRole } from '../user/common/enums/userRole.enum';

@Injectable()
export class TokenService {
  private tokensUtil: TokensUtil;
  private saltRounds = 10;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    this.tokensUtil = new TokensUtil(this.configService, this.jwtService);
  }

  async createTokensForUser(user: AuthenticatedUserDto): Promise<AuthTokens> {
    const payload = {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.tokensUtil.signAccessToken(payload);
    const refreshToken = await this.tokensUtil.signRefreshToken(payload);

    const refreshHash = await bcrypt.hash(refreshToken, this.saltRounds);
    await this.userService.setRefreshTokenHash(String(user.id), refreshHash);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.userService.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Sesión invalida');
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) throw new ForbiddenException('Token de actualización inválido');

    const userDto: AuthenticatedUserDto = {
      id: String(user._id),
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    };

    return this.createTokensForUser(userDto);
  }

  async signVerificationToken(payload: { sub: string; email: string; role: UserRole }) {
    return this.tokensUtil.signVerificationToken(payload);
  }

  async verifyToken(token: string) {
    return this.tokensUtil.verifyToken(token);
  }

  setCookies(res: Response, tokens: AuthTokens) {
    res.cookie(ACCESS_COOKIE, tokens.accessToken, cookieOptions(this.configService, false));
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(this.configService, true));
  }

  clearCookies(res: Response) {
    res.clearCookie(ACCESS_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_COOKIE, { path: '/auth/refresh' });
  }
}
