import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminDashboardPage } from '@/pages/admin/admin-dashboard-page'
import { LoginPage } from '@/pages/auth/login-page'
import { RegisterPage } from '@/pages/auth/register-page'
import { ComplaintDetailPage } from '@/pages/citizen/complaint-detail-page'
import { ComplaintsPage } from '@/pages/citizen/complaints-page'
import { DashboardPage } from '@/pages/citizen/dashboard-page'
import { MapPage } from '@/pages/citizen/map-page'
import { ReportPage } from '@/pages/citizen/report-page'
import { LandingPage } from '@/pages/public/landing-page'
import { AuthLayout } from '@/layouts/auth-layout'
import { AppLayout } from '@/layouts/app-layout'
import { PublicLayout } from '@/layouts/public-layout'
import { ProtectedRoute } from '@/routes/protected-route'
import { routes } from '@/constants/routes'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={routes.home} element={<LandingPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.register} element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={routes.dashboard} element={<DashboardPage />} />
          <Route path={routes.report} element={<ReportPage />} />
          <Route path={routes.complaints} element={<ComplaintsPage />} />
          <Route path={routes.complaintDetail} element={<ComplaintDetailPage />} />
          <Route path={routes.map} element={<MapPage />} />
          <Route path={routes.admin} element={<AdminDashboardPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={routes.home} replace />} />
    </Routes>
  )
}
