import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '@/components/civic/logo'
import { SkipLink } from '@/components/layout/site-chrome'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { appNavLinks } from '@/components/navigation/nav-links'
import { PageTransition } from '@/components/common/page-transition'
import { Button } from '@/components/ui/button'
import { routes } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'

export function AppLayout() {
  const location = useLocation()
  const flush = location.pathname === routes.map
  const { user, logout } = useAuth()
  const links = appNavLinks.filter((link) => link.to !== routes.admin || user?.role === 'admin')

  return (
    <div className="min-h-svh bg-paper">
      <SkipLink />
      <div className="flex min-h-svh">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-surface lg:flex">
          <div className="flex h-14 items-center px-4">
            <Logo />
          </div>
          <nav className="flex flex-col gap-0.5 px-2" aria-label="Application">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-brand-soft text-brand-ink' : 'text-ink-muted hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto px-2 py-4">
            <NavLink to={routes.profile} className="truncate px-3 text-xs text-ink-subtle hover:text-ink">
              {user?.name}
            </NavLink>
            <Button variant="ghost" className="mt-2 w-full justify-start" onClick={() => void logout()}>
              Sign out
            </Button>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 items-center border-b border-line bg-surface px-4 lg:hidden">
            <Logo />
          </div>
          <main
            id="main"
            className={cn(
              'flex-1 pb-20 lg:pb-0',
              flush ? 'p-0' : 'px-4 py-6 sm:px-6 lg:px-8 lg:py-8',
            )}
          >
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
