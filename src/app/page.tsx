import { HeroSection } from '@/components/home/HeroSection'
import { LiveStats } from '@/components/home/LiveStats'
import { SectionDivider } from '@/components/home/SectionDivider'
import { TrendingRoles } from '@/components/home/TrendingRoles'
import { PopularKeywords } from '@/components/home/PopularKeywords'
import { SkillRoadmap } from '@/components/home/SkillRoadmap'
import { ResumeSection } from '@/components/home/ResumeSection'
import { TrendingKeywords } from '@/components/home/TrendingKeywords'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiveStats />
      <SectionDivider />
      <TrendingRoles />
      <PopularKeywords />
      <SkillRoadmap />
      <ResumeSection />
      <TrendingKeywords />
    </>
  )
}
