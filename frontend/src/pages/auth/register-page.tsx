import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { routes } from '@/constants/routes'
import { isValidEmail, requiredMessage, type FieldErrors } from '@/lib/validation'
import { FieldError } from '@/components/common/field-error'

type RegisterFields = 'name' | 'email' | 'password' | 'confirmPassword' | 'location'

export function RegisterPage() {
  const { push } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [location, setLocation] = useState('')
  const [errors, setErrors] = useState<FieldErrors<RegisterFields>>({})

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FieldErrors<RegisterFields> = {}

    if (!name.trim()) nextErrors.name = requiredMessage('Name')
    if (!email.trim()) nextErrors.email = requiredMessage('Email')
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.'
    if (!password) nextErrors.password = requiredMessage('Password')
    else if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    if (!confirmPassword) nextErrors.confirmPassword = requiredMessage('Confirm password')
    else if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match.'
    if (!location.trim()) nextErrors.location = requiredMessage('Location')

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    push({
      tone: 'info',
      title: 'Registration is not connected yet',
      description: 'Accounts will be created in a later phase. Your form is valid.',
    })
  }

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight text-ink">Create an account</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Report issues from your neighborhood and follow them through to resolution.
      </p>
      <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            invalid={Boolean(errors.name)}
          />
          <FieldError message={errors.name} />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            invalid={Boolean(errors.password)}
          />
          <FieldError message={errors.password} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            invalid={Boolean(errors.confirmPassword)}
          />
          <FieldError message={errors.confirmPassword} />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            autoComplete="address-level2"
            placeholder="City or neighborhood"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            invalid={Boolean(errors.location)}
          />
          <FieldError message={errors.location} />
        </div>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-muted">
        Already registered?{' '}
        <Link to={routes.login} className="text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
