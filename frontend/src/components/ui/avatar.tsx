import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string
  className?: string
}

function initialsFromName(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function Avatar({ name, src, className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-xs font-medium text-brand-ink',
        className,
      )}
    >
      <AvatarPrimitive.Image src={src} alt="" className="size-full object-cover" />
      <AvatarPrimitive.Fallback delayMs={src ? 400 : 0}>
        {initialsFromName(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
