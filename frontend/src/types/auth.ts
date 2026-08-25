export type UserRole = 'citizen' | 'authority' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  location?: {
    address?: string
    city?: string
    state?: string
    postalCode?: string
  }
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isReady: boolean
  error: string | null
  login: (input: { email: string; password: string }) => Promise<AuthUser>
  register: (input: { name: string; email: string; password: string; location?: string }) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}
