import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-medium tracking-[0.14em] text-ink-subtle uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-[2rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-prose text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium tracking-[0.16em] text-brand uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-[1.75rem] leading-tight tracking-tight text-ink sm:text-[2rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-[0.975rem] leading-relaxed text-ink-muted">{description}</p>
      ) : null}
    </div>
  )
}
