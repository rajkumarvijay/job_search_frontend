import type { Metadata } from 'next'
import { SignUpClient } from '@/components/auth/SignUpClient'

export const metadata: Metadata = {
  title: 'Sign Up – JobQuest',
  description: 'Create your free JobQuest account.',
}

export default function SignUpPage() {
  return <SignUpClient />
}
