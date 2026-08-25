import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loginRequest, logoutRequest, meRequest, refreshRequest, registerRequest } from '@/lib/api/auth'
import { ApiRequestError } from '@/lib/api/client'
import type { AuthContextValue, AuthUser } from '@/types/auth'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refreshUser() {
    try {
      const current = await meRequest()
      setUser(current)
      setError(null)
    } catch (caught) {
      if (caught instanceof ApiRequestError && caught.status === 401) {
        try {
          const refreshed = await refreshRequest()
          setUser(refreshed)
          setError(null)
          return
        } catch {
          setUser(null)
          return
        }
      }
      setUser(null)
    }
  }

  useEffect(() => {
    void refreshUser().finally(() => setIsLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      isReady: !isLoading,
      error,
      async login(input) {
        setError(null)
        const next = await loginRequest(input)
        setUser(next)
        return next
      },
      async register(input) {
        setError(null)
        const next = await registerRequest(input)
        setUser(next)
        return next
      },
      async logout() {
        await logoutRequest().catch(() => undefined)
        setUser(null)
      },
      refreshUser,
    }),
    [user, isLoading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
