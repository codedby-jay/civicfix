import { categoryIcons } from '@/lib/icons'
import { issueCategories } from '@/data/issue-categories'

export function IssueCategoryList() {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {issueCategories.map((category, index) => {
        const Icon = categoryIcons[category.id]
        return (
          <li
            key={category.id}
            className="flex items-start gap-3 border-t border-line py-5 sm:px-4 sm:odd:pl-0 lg:px-5 lg:[&:nth-child(4n+1)]:pl-0"
          >
            <span className="font-mono text-[11px] text-ink-subtle">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            <div>
              <p className="text-sm font-medium text-ink">{category.label}</p>
              <p className="mt-1 text-sm text-ink-muted">{category.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
