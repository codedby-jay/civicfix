import { AboutSection } from '@/pages/public/landing/about-section'
import { FinalCtaSection } from '@/pages/public/landing/final-cta-section'
import { HeroSection } from '@/pages/public/landing/hero-section'
import { HowItWorksSection } from '@/pages/public/landing/how-it-works-section'
import { ImpactSection } from '@/pages/public/landing/impact-section'
import { IntelligenceSection } from '@/pages/public/landing/intelligence-section'
import { IssueTypesSection } from '@/pages/public/landing/issue-types-section'
import { MapExperienceSection } from '@/pages/public/landing/map-experience-section'
import { TransparencySection } from '@/pages/public/landing/transparency-section'

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <ImpactSection />
      <HowItWorksSection />
      <IssueTypesSection />
      <MapExperienceSection />
      <TransparencySection />
      <IntelligenceSection />
      <AboutSection />
      <FinalCtaSection />
    </>
  )
}
