import { Metadata } from 'next'
import { ResumeAnalyzerClient } from '@/components/resume/ResumeAnalyzerClient'

export const metadata: Metadata = {
  title: 'AI Resume Analyser | Job Quest',
  description: 'Upload your resume and get an instant ATS score, improvement tips, and AI-powered job recommendations.',
}

export default function ResumePage() {
  return <ResumeAnalyzerClient />
}
