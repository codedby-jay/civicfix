import { Router } from 'express'
import { login, logout, me, refresh, register } from '../controllers/auth.controller.js'
import { optionalAuth, requireAuth } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { loginSchema, registerSchema } from '../validators/auth.validator.js'
import { rateLimit } from 'express-rate-limit'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
})

export const authRouter = Router()

authRouter.post('/register', authLimiter, validate(registerSchema), register)
authRouter.post('/login', authLimiter, validate(loginSchema), login)
authRouter.post('/logout', optionalAuth, logout)
authRouter.get('/me', requireAuth, me)
authRouter.post('/refresh', refresh)
