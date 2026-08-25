import { IssueCategoryList } from '@/components/civic/issue-category-list'
import { Reveal } from '@/components/common/reveal'
import { SectionHeader } from '@/components/common/page-header'

export function IssueTypesSection() {
  return (
    <section id="explore-issues" className="scroll-mt-20 border-b border-line bg-surface">
      <div className="container-wide py-20">
        <Reveal>
          <SectionHeader
            eyebrow="Issue types"
            title="The problems cities actually hear about"
            description="CivicFix is built around everyday infrastructure — not generic tickets."
          />
        </Reveal>
        <Reveal className="mt-10">
          <IssueCategoryList />
        </Reveal>
      </div>
    </section>
  )
}
