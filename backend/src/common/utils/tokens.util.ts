import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';

export class TokensUtil {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  private toExpiresIn(value: string) {
    return value as `${number}${'s' | 'm' | 'h' | 'd'}`;
  }

  async signAccessToken(payload: JwtPayloadDto) {
    const exp = this.toExpiresIn(this.config.get<string>('JWT_ACCESS_EXPIRATION') ?? '15m');
    return await this.jwtService.signAsync(payload, { expiresIn: exp });
  }

  async signRefreshToken(payload: JwtPayloadDto) {
    const exp = this.toExpiresIn(this.config.get<string>('JWT_REFRESH_EXPIRATION') ?? '7d');
    return await this.jwtService.signAsync(payload, { expiresIn: exp });
  }

  async signVerificationToken(payload: JwtPayloadDto) {
    const exp = this.toExpiresIn(this.config.get<string>('JWT_VERIFICATION_EXPIRATION') ?? '1h');
    return await this.jwtService.signAsync(payload, { expiresIn: exp });
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync<JwtPayloadDto>(token);
  }
}
