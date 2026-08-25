import type { CookieOptions, Response } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from '../utils/generateToken.js'
import type { z } from 'zod'
import type { locationInputSchema, registerSchema } from '../validators/auth.validator.js'

const ACCESS_MS = 15 * 60 * 1000
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000

type LocationInput = z.infer<typeof locationInputSchema>

function normalizeLocation(input: string | LocationInput | undefined) {
  if (!input) return {}
  if (typeof input === 'string') return { city: input }
  return input
}

function publicUser(user: {
  _id: { toString(): string }
  name: string
  email: string
  role: string
  phone?: string
  location?: unknown
  avatar?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone ?? '',
    location: user.location ?? {},
    avatar: user.avatar ?? '',
    isActive: user.isActive ?? true,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function setAuthCookies(res: Response, access: string, refresh: string): void {
  const accessOpts: CookieOptions = cookieOptions(ACCESS_MS)
  const refreshOpts: CookieOptions = cookieOptions(REFRESH_MS)
  res.cookie(ACCESS_COOKIE, access, accessOpts)
  res.cookie(REFRESH_COOKIE, refresh, refreshOpts)
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, { ...cookieOptions(0), maxAge: 0 })
  res.clearCookie(REFRESH_COOKIE, { ...cookieOptions(0), maxAge: 0 })
}

export async function registerUser(input: z.infer<typeof registerSchema>, res: Response) {
  const email = input.email.trim().toLowerCase()
  const existing = await User.findOne({ email })
  if (existing) {
    throw ApiError.conflict('An account with this email already exists')
  }

  const user = await User.create({
    name: input.name.trim(),
    email,
    password: input.password,
    phone: input.phone?.trim() ?? '',
    location: normalizeLocation(input.location),
    role: 'citizen',
  })

  const tokenUser = await User.findById(user._id).select('+tokenVersion')
  if (!tokenUser) throw ApiError.notFound('User not found')
  issueSession(tokenUser, res)
  return publicUser(user)
}

export async function loginUser(email: string, password: string, res: Response) {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password +tokenVersion')
  const hashed = user?.password
  const valid = hashed ? await bcrypt.compare(password, hashed) : false
  if (!user || !valid || !user.isActive) {
    throw ApiError.unauthorized('Invalid email or password')
  }
  issueSession(user, res)
  return publicUser(user)
}

export async function logoutUser(userId: string | undefined, res: Response) {
  if (userId) {
    await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } })
  }
  clearAuthCookies(res)
}

export async function refreshSession(refreshToken: string | undefined, res: Response) {
  if (!refreshToken) throw ApiError.unauthorized()
  let payload
  try {
    payload = verifyToken(refreshToken)
  } catch {
    throw ApiError.unauthorized()
  }
  if (payload.type !== 'refresh') throw ApiError.unauthorized()

  const user = await User.findById(payload.sub).select('+tokenVersion')
  if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
    throw ApiError.unauthorized()
  }
  issueSession(user, res)
  return publicUser(user)
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId)
  if (!user || !user.isActive) throw ApiError.unauthorized()
  return publicUser(user)
}

function issueSession(
  user: { _id: { toString(): string }; role: string; tokenVersion: number },
  res: Response,
) {
  const payload = {
    sub: user._id.toString(),
    role: user.role as 'citizen' | 'authority' | 'admin',
    tokenVersion: user.tokenVersion,
  }
  setAuthCookies(res, signAccessToken(payload), signRefreshToken(payload))
}
