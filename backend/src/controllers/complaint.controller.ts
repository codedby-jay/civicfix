import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  addTimelineEntry,
  createComplaint,
  deleteComplaint,
  getComplaint,
  listComplaints,
  updateComplaint,
  updateComplaintStatus,
} from '../services/complaint.service.js'

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = await createComplaint(req.auth!, req.body)
  res.status(201).json({ success: true, data })
})

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await listComplaints(req.auth!, req.validatedQuery as never)
  res.status(200).json({ success: true, ...result })
})

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const data = await getComplaint(req.auth!, String(req.params.id ?? ''))
  res.status(200).json({ success: true, data })
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = await updateComplaint(req.auth!, String(req.params.id ?? ''), req.body)
  res.status(200).json({ success: true, data })
})

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const data = await updateComplaintStatus(req.auth!, String(req.params.id ?? ''), req.body)
  res.status(200).json({ success: true, data })
})

export const addTimeline = asyncHandler(async (req: Request, res: Response) => {
  const data = await addTimelineEntry(req.auth!, String(req.params.id ?? ''), req.body)
  res.status(200).json({ success: true, data })
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const data = await deleteComplaint(req.auth!, String(req.params.id ?? ''))
  res.status(200).json({ success: true, data })
})
