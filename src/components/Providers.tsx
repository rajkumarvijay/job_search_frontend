'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useAuthStore } from '@/store/useAuthStore'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''

function SessionInit() {
  const initSession = useAppStore((s) => s.initSession)
  const initAuth    = useAuthStore((s) => s.initAuth)
  const ran = useRef(false)
  useEffect(() => {
    if (!ran.current) {
      ran.current = true
      initSession()
      initAuth()
    }
  }, [initSession, initAuth])
  return null
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <SessionInit />
        {children}
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}
