import { Router } from 'express'
import {
  addTimeline,
  create,
  getOne,
  list,
  remove,
  update,
  updateStatus,
} from '../controllers/complaint.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import {
  createComplaintSchema,
  listComplaintsQuerySchema,
  timelineSchema,
  updateComplaintSchema,
  updateStatusSchema,
} from '../validators/complaint.validator.js'

export const complaintRouter = Router()

complaintRouter.use(requireAuth)
complaintRouter.post('/', validate(createComplaintSchema), create)
complaintRouter.get('/', validate(listComplaintsQuerySchema, 'query'), list)
complaintRouter.get('/:id', getOne)
complaintRouter.patch('/:id', requireRole('authority', 'admin'), validate(updateComplaintSchema), update)
complaintRouter.patch(
  '/:id/status',
  requireRole('authority', 'admin'),
  validate(updateStatusSchema),
  updateStatus,
)
complaintRouter.post(
  '/:id/timeline',
  requireRole('authority', 'admin'),
  validate(timelineSchema),
  addTimeline,
)
complaintRouter.delete('/:id', requireRole('admin'), remove)
