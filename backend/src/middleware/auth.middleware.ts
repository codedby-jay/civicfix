import type { NextFunction, Request, Response } from 'express'
import { User } from '../models/User.js'
import type { UserRole } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { ACCESS_COOKIE, verifyToken } from '../utils/generateToken.js'

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = readAccessToken(req)
  if (!token) {
    next(ApiError.unauthorized())
    return
  }

  void (async () => {
    try {
      const payload = verifyToken(token)
      if (payload.type !== 'access') throw ApiError.unauthorized()
      const user = await User.findById(payload.sub).select('+tokenVersion')
      if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
        throw ApiError.unauthorized()
      }
      req.auth = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        tokenVersion: user.tokenVersion,
      }
      next()
    } catch (error) {
      if (error instanceof ApiError) next(error)
      else next(ApiError.unauthorized('Invalid or expired token'))
    }
  })()
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      next(ApiError.unauthorized())
      return
    }
    if (!roles.includes(req.auth.role)) {
      next(ApiError.forbidden())
      return
    }
    next()
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = readAccessToken(req)
  if (!token) {
    next()
    return
  }
  void (async () => {
    try {
      const payload = verifyToken(token)
      if (payload.type !== 'access') {
        next()
        return
      }
      const user = await User.findById(payload.sub).select('+tokenVersion')
      if (user && user.isActive && user.tokenVersion === payload.tokenVersion) {
        req.auth = {
          id: user._id.toString(),
          role: user.role,
          email: user.email,
          tokenVersion: user.tokenVersion,
        }
      }
    } catch {
      /* ignore */
    }
    next()
  })()
}

function readAccessToken(req: Request): string | undefined {
  const cookie = req.cookies?.[ACCESS_COOKIE] as string | undefined
  if (cookie) return cookie
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) return header.slice(7)
  return undefined
}
