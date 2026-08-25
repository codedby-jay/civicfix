import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink shadow-sm transition-colors placeholder:text-ink-subtle',
        'focus-visible:border-brand',
        invalid ? 'border-error' : 'border-line-strong',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}
