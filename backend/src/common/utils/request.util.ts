import { Request } from 'express';

export function getCookie(req: Request, cookieName: string): string | undefined {
  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.[cookieName];
}
