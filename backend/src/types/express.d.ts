import type { UserRole } from '../models/User.js'

declare global {
  namespace Express {
    interface Request {
      auth?: {
        id: string
        role: UserRole
        email: string
        tokenVersion: number
      }
      validatedQuery?: unknown
      validatedParams?: unknown
    }
  }
}

export {}
