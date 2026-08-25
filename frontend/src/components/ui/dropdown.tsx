import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'center' | 'end'
}

export function Dropdown({ trigger, children, align = 'end' }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          className="z-50 min-w-44 rounded-md border border-line bg-surface p-1 shadow-md"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export function DropdownItem({
  children,
  onSelect,
  className,
}: {
  children: ReactNode
  onSelect?: () => void
  className?: string
}) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        'flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm text-ink outline-none data-[highlighted]:bg-brand-soft',
        className,
      )}
    >
      {children}
    </DropdownMenu.Item>
  )
}
