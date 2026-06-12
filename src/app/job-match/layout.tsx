import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Job Match Score — JobQuest India',
  description: 'Instantly find out how well your resume matches a job description. Get a match score, missing skills, strengths, and personalised learning recommendations — powered by Gemini AI.',
}

export default function JobMatchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
