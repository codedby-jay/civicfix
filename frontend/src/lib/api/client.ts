const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

export class ApiRequestError extends Error {
  readonly status: number
  readonly errors: { field?: string; message: string }[]

  constructor(status: number, message: string, errors: { field?: string; message: string }[] = []) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  const payload = (await response.json().catch(() => null)) as
    | { success?: boolean; data?: T; message?: string; errors?: { field?: string; message: string }[] }
    | null

  if (!response.ok || payload?.success === false) {
    throw new ApiRequestError(
      response.status,
      payload?.message ?? 'Request failed',
      payload?.errors ?? [],
    )
  }

  return (payload?.data as T) ?? (payload as T)
}
