import { HeroSection }      from '@/components/home/HeroSection'
import { TrustLogos }       from '@/components/home/TrustLogos'
import { LiveStats }        from '@/components/home/LiveStats'
import { PainSolution }     from '@/components/home/PainSolution'
import { FeaturesShowcase } from '@/components/home/FeaturesShowcase'
import { TrendingRoles }    from '@/components/home/TrendingRoles'
import { Testimonials }     from '@/components/home/Testimonials'
import { ResumeSection }    from '@/components/home/ResumeSection'
import { FinalCTA }         from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — search bar + social proof row */}
      <HeroSection />

      {/* 2. Trust logos marquee — top companies hiring */}
      <TrustLogos />

      {/* 3. Live animated stats */}
      <LiveStats />

      {/* 4. Pain → Solution — why JobQuest exists */}
      <PainSolution />

      {/* 5. Feature showcase — 4 key features */}
      <FeaturesShowcase />

      {/* 6. Trending roles — horizontal scroll */}
      <TrendingRoles />

      {/* 7. Testimonials — 6 user quotes */}
      <Testimonials />

      {/* 8. Resume scorer promo */}
      <ResumeSection />

      {/* 9. Final CTA — conversion section */}
      <FinalCTA />
    </>
  )
}
