export class ApiError extends Error {
  readonly statusCode: number
  readonly errors: { field?: string; message: string }[]
  readonly isOperational: boolean

  constructor(
    statusCode: number,
    message: string,
    errors: { field?: string; message: string }[] = [],
  ) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.isOperational = true
  }

  static badRequest(message: string, errors: { field?: string; message: string }[] = []): ApiError {
    return new ApiError(400, message, errors)
  }

  static unauthorized(message = 'Authentication required'): ApiError {
    return new ApiError(401, message)
  }

  static forbidden(message = 'You do not have permission to perform this action'): ApiError {
    return new ApiError(403, message)
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message)
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message)
  }
}
