import { Navigate, Outlet } from 'react-router-dom'
import { PHASE1_ALLOW_UNAUTHENTICATED_APP_ROUTES } from '@/constants/phase'
import { routes } from '@/constants/routes'
import { useAuth } from '@/providers/auth-provider'

export function ProtectedRoute() {
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return null
  }

  if (!isAuthenticated && !PHASE1_ALLOW_UNAUTHENTICATED_APP_ROUTES) {
    return <Navigate to={routes.login} replace />
  }

  return <Outlet />
}
