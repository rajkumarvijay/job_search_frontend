import type { Metadata } from 'next'
import { PostJobClient } from '@/components/post-job/PostJobClient'

export const metadata: Metadata = {
  title: 'Post a Job – JobQuest',
  description: 'Reach thousands of job seekers across India. Post your opening on JobQuest for free.',
}

export default function PostJobPage() {
  return <PostJobClient />
}
