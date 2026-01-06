import { NextRequest } from 'next/server';
import { UserRole } from '../../types/auth.types';

export interface DecodedToken {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export async function getCurrentUser(req: NextRequest): Promise<DecodedToken | null> {
  const accessToken = req.cookies.get('access_token')?.value;
  
  if (!accessToken) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
    );

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.error('Token decode failed:', error);
    return null;
  }
}

export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(req);
  
  if (!user) return false;
  
  const now = Math.floor(Date.now() / 1000);
  return user.exp > now;
}

export async function hasRole(req: NextRequest, allowedRoles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser(req);
  
  if (!user) return false;
  
  return allowedRoles.includes(user.role);
}