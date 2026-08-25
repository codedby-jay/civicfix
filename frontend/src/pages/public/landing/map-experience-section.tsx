import { CivicMapPreview } from '@/components/civic/civic-map-preview'
import { Reveal } from '@/components/common/reveal'
import { SectionHeader } from '@/components/common/page-header'
import { DemoBanner } from '@/components/common/demo-banner'

export function MapExperienceSection() {
  return (
    <section id="map-experience" className="scroll-mt-20 border-b border-line">
      <div className="container-wide py-16">
        <Reveal>
          <SectionHeader
            eyebrow="Civic map"
            title="See what is happening on the ground"
            description="Markers cluster nearby reports. Select one to read severity, status, and location — without leaving the map."
          />
          <DemoBanner className="mt-4" />
        </Reveal>
        <Reveal className="mt-8">
          <CivicMapPreview className="min-h-[26rem] sm:min-h-[30rem]" />
        </Reveal>
      </div>
    </section>
  )
}
