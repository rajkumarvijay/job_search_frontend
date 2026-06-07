'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect, useRef, useState } from 'react'
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

/**
 * GoogleOAuthProvider accesses browser APIs during initialisation.
 * We must only render it on the client (after hydration) AND only when
 * a valid client-id is configured, otherwise the page crashes on SSR.
 */
function SafeGoogleProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Before hydration, or if no client-id is set, skip the provider entirely.
  // NavbarAuth (the only consumer of useGoogleLogin) is already loaded with
  // ssr:false, so Google login simply won't be available if the env var is
  // missing — the rest of the app still works fine.
  if (!mounted || !GOOGLE_CLIENT_ID) {
    return <>{children}</>
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SafeGoogleProvider>
      <QueryClientProvider client={queryClient}>
        <SessionInit />
        {children}
      </QueryClientProvider>
    </SafeGoogleProvider>
  )
}
