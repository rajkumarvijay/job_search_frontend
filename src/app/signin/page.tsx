import type { Metadata } from 'next'
import { SignInClient } from '@/components/auth/SignInClient'

export const metadata: Metadata = {
  title: 'Sign In – JobQuest',
  description: 'Sign in to your JobQuest account.',
}

export default function SignInPage() {
  return <SignInClient />
}
