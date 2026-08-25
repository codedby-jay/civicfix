import { z } from 'zod'
import { USER_ROLES } from '../models/User.js'

export const locationInputSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().trim().optional(),
  location: z.union([z.string().trim().min(1), locationInputSchema]).optional(),
})

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  location: locationInputSchema.optional(),
  avatar: z.string().trim().optional(),
})

export const adminUpdateUserSchema = updateProfileSchema.extend({
  role: z.enum(USER_ROLES).optional(),
  isActive: z.boolean().optional(),
})
