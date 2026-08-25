import { Router } from 'express'
import { getMe, getUser, getUsers, patchMe, patchUser } from '../controllers/user.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { adminUpdateUserSchema, updateProfileSchema } from '../validators/auth.validator.js'

export const userRouter = Router()

userRouter.use(requireAuth)
userRouter.get('/me', getMe)
userRouter.patch('/me', validate(updateProfileSchema), patchMe)
userRouter.get('/', requireRole('admin'), getUsers)
userRouter.get('/:id', getUser)
userRouter.patch('/:id', requireRole('admin'), validate(adminUpdateUserSchema), patchUser)
