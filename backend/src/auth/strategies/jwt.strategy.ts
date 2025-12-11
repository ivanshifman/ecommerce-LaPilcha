import { Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const options: StrategyOptions = {
      jwtFromRequest: (req?: Request): string | null => {
        if (!req) return null;
        return req.cookies && req.cookies['access_token']
          ? String(req.cookies['access_token'])
          : null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    };
    super(options);
  }

  validate(payload: JwtPayloadDto) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
