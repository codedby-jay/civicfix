import { z } from 'zod'
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_SEVERITIES,
  COMPLAINT_STATUSES,
} from '../models/Complaint.js'
import { locationInputSchema } from './auth.validator.js'

export const createComplaintSchema = z.object({
  title: z.string().trim().min(4, 'Title must be at least 4 characters'),
  description: z.string().trim().min(12, 'Description must be at least 12 characters'),
  category: z.enum(COMPLAINT_CATEGORIES),
  severity: z.enum(COMPLAINT_SEVERITIES),
  priority: z.enum(COMPLAINT_PRIORITIES).optional(),
  location: locationInputSchema
    .extend({
      city: z.string().optional(),
      address: z.string().optional(),
    })
    .refine((value) => Boolean(value.city?.trim() || value.address?.trim()), {
      message: 'Provide a city or street address',
    }),
  images: z.array(z.string().url().or(z.string().min(1))).max(8).optional(),
  department: z.string().trim().optional(),
})

export const updateComplaintSchema = z.object({
  title: z.string().trim().min(4).optional(),
  description: z.string().trim().min(12).optional(),
  category: z.enum(COMPLAINT_CATEGORIES).optional(),
  severity: z.enum(COMPLAINT_SEVERITIES).optional(),
  priority: z.enum(COMPLAINT_PRIORITIES).optional(),
  location: locationInputSchema.optional(),
  department: z.string().trim().optional(),
  assignedTo: z.string().optional().nullable(),
  images: z.array(z.string()).max(8).optional(),
})

export const updateStatusSchema = z.object({
  status: z.enum(COMPLAINT_STATUSES),
  message: z.string().trim().min(4).optional(),
})

export const timelineSchema = z.object({
  status: z.enum(COMPLAINT_STATUSES).optional(),
  message: z.string().trim().min(4, 'Message must be at least 4 characters'),
})

export const listComplaintsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(COMPLAINT_STATUSES).optional(),
  severity: z.enum(COMPLAINT_SEVERITIES).optional(),
  category: z.enum(COMPLAINT_CATEGORIES).optional(),
  search: z.string().trim().optional(),
  sort: z.string().optional().default('-createdAt'),
  scope: z.enum(['own', 'public', 'assigned', 'all']).optional(),
})
