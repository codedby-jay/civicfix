import type { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { ZodError } from 'zod'
import { loadEnv } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const env = loadEnv()

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
    return
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    })
    return
  }

  if (isDuplicateKey(err)) {
    res.status(409).json({
      success: false,
      message: 'A record with that value already exists',
      errors: [],
    })
    return
  }

  const message = env.NODE_ENV === 'production' ? 'Unexpected server error' : errorMessage(err)
  if (env.NODE_ENV !== 'production') {
    console.error(err)
  }
  res.status(500).json({
    success: false,
    message,
    errors: [],
  })
}

function isDuplicateKey(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unexpected server error'
}
