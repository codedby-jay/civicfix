import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'

export function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Account"
        title={user?.name ?? 'Profile'}
        description={user?.email}
      />
      <dl className="mt-8 space-y-4 text-sm">
        <div>
          <dt className="text-ink-subtle">Role</dt>
          <dd className="mt-1 capitalize text-ink">{user?.role}</dd>
        </div>
        {user?.location?.city ? (
          <div>
            <dt className="text-ink-subtle">Location</dt>
            <dd className="mt-1 text-ink">{user.location.city}</dd>
          </div>
        ) : null}
      </dl>
      <Button variant="ghost" className="mt-8" onClick={() => void logout()}>
        Sign out
      </Button>
    </div>
  )
}
