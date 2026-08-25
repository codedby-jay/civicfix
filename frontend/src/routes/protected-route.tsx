import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingState } from '@/components/common/state-panels'
import { routes } from '@/constants/routes'
import { useAuth } from '@/providers/auth-provider'
import type { UserRole } from '@/types/auth'

export function ProtectedRoute() {
  const { isAuthenticated, isReady } = useAuth()
  const location = useLocation()

  if (!isReady) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <LoadingState label="Checking session" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <LoadingState label="Checking session" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={routes.dashboard} replace />
  }

  return <Outlet />
}

export function RequireRole({ roles }: { roles: UserRole[] }) {
  const { user, isReady } = useAuth()

  if (!isReady) return null
  if (!user || !roles.includes(user.role)) {
    return <Navigate to={routes.dashboard} replace />
  }

  return <Outlet />
}
