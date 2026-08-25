import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import type { z } from 'zod'
import type { adminUpdateUserSchema, updateProfileSchema } from '../validators/auth.validator.js'

function publicUser(user: InstanceType<typeof User>) {
  return user.toJSON()
}

export async function getUserById(id: string, requester: { id: string; role: string }) {
  if (requester.role !== 'admin' && requester.id !== id) {
    throw ApiError.forbidden()
  }
  const user = await User.findById(id)
  if (!user) throw ApiError.notFound('User not found')
  return publicUser(user)
}

export async function updateOwnProfile(
  userId: string,
  input: z.infer<typeof updateProfileSchema>,
) {
  const user = await User.findByIdAndUpdate(userId, input, { new: true, runValidators: true })
  if (!user) throw ApiError.notFound('User not found')
  return publicUser(user)
}

export async function adminUpdateUser(id: string, input: z.infer<typeof adminUpdateUserSchema>) {
  const user = await User.findByIdAndUpdate(id, input, { new: true, runValidators: true })
  if (!user) throw ApiError.notFound('User not found')
  return publicUser(user)
}

export async function listUsers() {
  const users = await User.find().sort({ createdAt: -1 }).limit(100)
  return users.map((user) => publicUser(user))
}
