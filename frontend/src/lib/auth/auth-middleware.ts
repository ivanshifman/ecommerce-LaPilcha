import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { UserRole } from '../../types/auth.types';


const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET
);

export interface DecodedToken {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as DecodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function getCurrentUser(req: NextRequest): Promise<DecodedToken | null> {
  const accessToken = req.cookies.get('access_token')?.value;
  
  if (!accessToken) {
    return null;
  }

  return await verifyToken(accessToken);
}

export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(req);
  return user !== null;
}

export async function hasRole(req: NextRequest, allowedRoles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser(req);
  
  if (!user) return false;
  
  return allowedRoles.includes(user.role);
}