import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/civic/logo'
import { SkipLink } from '@/components/layout/site-chrome'
import { appNavLinks } from '@/components/navigation/nav-links'
import { cn } from '@/lib/utils'

export function AppLayout() {
  return (
    <div className="min-h-svh bg-paper">
      <SkipLink />
      <div className="flex min-h-svh">
        <aside className="hidden w-60 shrink-0 border-r border-line bg-surface md:block">
          <div className="flex h-16 items-center px-5">
            <Logo />
          </div>
          <nav className="flex flex-col gap-0.5 px-3" aria-label="Application">
            {appNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm',
                    isActive ? 'bg-brand-soft text-brand-ink' : 'text-ink-muted hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-16 items-center border-b border-line bg-surface px-4 md:hidden">
            <Logo />
          </div>
          <nav
            className="flex gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-2 md:hidden"
            aria-label="Application mobile"
          >
            {appNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'shrink-0 rounded-md px-3 py-1.5 text-sm',
                    isActive ? 'bg-brand-soft text-brand-ink' : 'text-ink-muted',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <main id="main" className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
