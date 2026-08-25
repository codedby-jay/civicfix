import type { Request, Response } from 'express'
import { REFRESH_COOKIE } from '../utils/generateToken.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.service.js'

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await registerUser(req.body, res)
  res.status(201).json({ success: true, data })
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await loginUser(req.body.email, req.body.password, res)
  res.status(200).json({ success: true, data })
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await logoutUser(req.auth?.id, res)
  res.status(200).json({ success: true, data: { loggedOut: true } })
})

export const me = asyncHandler(async (req: Request, res: Response) => {
  const data = await getCurrentUser(req.auth!.id)
  res.status(200).json({ success: true, data })
})

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined
  const data = await refreshSession(token, res)
  res.status(200).json({ success: true, data })
})
