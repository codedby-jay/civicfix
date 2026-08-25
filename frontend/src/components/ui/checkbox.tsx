import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

export function Checkbox({ id, checked, onCheckedChange, label }: CheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className={cn(
          'flex size-4 items-center justify-center rounded-sm border border-line-strong bg-surface',
          'data-[state=checked]:border-brand data-[state=checked]:bg-brand',
        )}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="size-3 text-white" aria-hidden />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label}
    </label>
  )
}
