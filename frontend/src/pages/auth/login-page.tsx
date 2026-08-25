import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { FieldError } from '@/components/common/field-error'
import { routes } from '@/constants/routes'
import { isValidEmail, requiredMessage, type FieldErrors } from '@/lib/validation'

type LoginFields = 'email' | 'password'

export function LoginPage() {
  const { push } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<FieldErrors<LoginFields>>({})

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FieldErrors<LoginFields> = {}

    if (!email.trim()) nextErrors.email = requiredMessage('Email')
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.'
    if (!password) nextErrors.password = requiredMessage('Password')
    else if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    push({
      tone: 'info',
      title: 'Sign-in is not connected yet',
      description: 'Authentication will be implemented in a later phase. Your form is valid.',
    })
  }

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Use your CivicFix account to report and track issues.
      </p>
      <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            invalid={Boolean(errors.email)}
          />
          <FieldError message={errors.email} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            invalid={Boolean(errors.password)}
          />
          <FieldError message={errors.password} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={setRemember}
            label="Remember me"
          />
          <button
            type="button"
            className="text-sm text-brand hover:underline"
            onClick={() =>
              push({
                tone: 'info',
                title: 'Password reset is not available yet',
                description: 'Account recovery will be added with authentication.',
              })
            }
          >
            Forgot password
          </button>
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-muted">
        No account yet?{' '}
        <Link to={routes.register} className="text-brand hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
