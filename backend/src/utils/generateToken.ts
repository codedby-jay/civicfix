import jwt from 'jsonwebtoken'
import { loadEnv } from '../config/env.js'
import type { UserRole } from '../models/User.js'

export interface TokenPayload {
  sub: string
  role: UserRole
  tokenVersion: number
  type: 'access' | 'refresh'
}

const REFRESH_EXPIRES_IN = '7d'

export function signAccessToken(payload: Omit<TokenPayload, 'type'>): string {
  const env = loadEnv()
  return jwt.sign({ ...payload, type: 'access' }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function signRefreshToken(payload: Omit<TokenPayload, 'type'>): string {
  const env = loadEnv()
  return jwt.sign({ ...payload, type: 'refresh' }, env.JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyToken(token: string): TokenPayload {
  const env = loadEnv()
  const decoded = jwt.verify(token, env.JWT_SECRET)
  if (typeof decoded === 'string' || !decoded.sub || !decoded.role || !decoded.type) {
    throw new Error('Invalid token payload')
  }
  return decoded as TokenPayload
}

export const ACCESS_COOKIE = 'civicfix_access'
export const REFRESH_COOKIE = 'civicfix_refresh'

export function cookieOptions(maxAgeMs: number) {
  const env = loadEnv()
  return {
    httpOnly: true as const,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeMs,
  }
}
