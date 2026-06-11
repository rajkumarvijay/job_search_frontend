import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator — JobQuest India',
  description: 'Generate a tailored, ATS-optimised cover letter in seconds. Upload your resume, paste the job description, and get a professional cover letter powered by Gemini AI — free.',
}

export default function CoverLetterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
