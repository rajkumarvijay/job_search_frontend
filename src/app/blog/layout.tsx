import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — JobQuest India',
  description: 'Career advice, resume tips, interview guides, and job search strategies for Indian professionals.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
