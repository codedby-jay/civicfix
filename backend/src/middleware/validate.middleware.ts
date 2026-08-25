import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { ApiError } from '../utils/ApiError.js'

export function validate(schema: ZodType, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[source])
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }))
      next(ApiError.badRequest('Validation failed', errors))
      return
    }
    if (source === 'query') {
      req.validatedQuery = parsed.data
    } else if (source === 'params') {
      req.validatedParams = parsed.data
    } else {
      req.body = parsed.data
    }
    next()
  }
}
