import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { adminUpdateUser, getUserById, listUsers, updateOwnProfile } from '../services/user.service.js'
import { ApiError } from '../utils/ApiError.js'

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const data = await getUserById(req.auth!.id, req.auth!)
  res.status(200).json({ success: true, data })
})

export const patchMe = asyncHandler(async (req: Request, res: Response) => {
  const data = await updateOwnProfile(req.auth!.id, req.body)
  res.status(200).json({ success: true, data })
})

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await getUserById(String(req.params.id ?? ''), req.auth!)
  res.status(200).json({ success: true, data })
})

export const patchUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.auth!.role !== 'admin') throw ApiError.forbidden()
  const data = await adminUpdateUser(String(req.params.id ?? ''), req.body)
  res.status(200).json({ success: true, data })
})

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  if (req.auth!.role !== 'admin') throw ApiError.forbidden()
  const data = await listUsers()
  res.status(200).json({ success: true, data })
})
