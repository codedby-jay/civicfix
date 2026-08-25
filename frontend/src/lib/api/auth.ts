import { apiRequest } from '@/lib/api/client'
import type { AuthUser } from '@/types/auth'

export interface RegisterInput {
  name: string
  email: string
  password: string
  location?: string
}

export interface LoginInput {
  email: string
  password: string
}

export function registerRequest(input: RegisterInput) {
  return apiRequest<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function loginRequest(input: LoginInput) {
  return apiRequest<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function logoutRequest() {
  return apiRequest<{ loggedOut: boolean }>('/auth/logout', { method: 'POST' })
}

export function meRequest() {
  return apiRequest<AuthUser>('/auth/me')
}

export function refreshRequest() {
  return apiRequest<AuthUser>('/auth/refresh', { method: 'POST' })
}
