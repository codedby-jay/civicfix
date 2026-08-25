export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'citizen' | 'admin'
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isReady: boolean
}
