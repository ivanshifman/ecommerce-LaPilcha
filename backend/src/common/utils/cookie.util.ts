import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

export function cookieOptions(config: ConfigService, isRefresh = false): CookieOptions {
  const isProd = config.get<string>('NODE_ENV') === 'production';
  const opts: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: isRefresh ? '/auth/refresh' : '/',
  };
  if (isRefresh) {
    opts.maxAge = parseDurationToMs(config.get<string>('JWT_REFRESH_EXPIRATION') ?? '7d');
  } else {
    opts.maxAge = parseDurationToMs(config.get<string>('JWT_ACCESS_EXPIRATION') ?? '15m');
  }
  return opts;
}

function parseDurationToMs(str: string) {
  if (!str) return 0;
  const num = parseInt(str.slice(0, -1), 10);
  const unit = str.slice(-1);
  switch (unit) {
    case 's':
      return num * 1000;
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    default:
      return num * 1000;
  }
}
