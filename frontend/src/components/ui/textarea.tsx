import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink shadow-sm transition-colors placeholder:text-ink-subtle',
        'focus-visible:border-brand',
        invalid ? 'border-error' : 'border-line-strong',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}
