import { HeroSection } from '@/components/home/HeroSection'
import { LiveStats } from '@/components/home/LiveStats'
import { TrendingRoles } from '@/components/home/TrendingRoles'
import { PopularKeywords } from '@/components/home/PopularKeywords'
import { PlatformComparison } from '@/components/home/PlatformComparison'
import { SkillRoadmap } from '@/components/home/SkillRoadmap'
import { ResumeSection } from '@/components/home/ResumeSection'
import { TrendingKeywords } from '@/components/home/TrendingKeywords'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiveStats />
      <TrendingRoles />
      <PopularKeywords />
      <PlatformComparison />
      <SkillRoadmap />
      <ResumeSection />
      <TrendingKeywords />
    </>
  )
}
