'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useAuthStore } from '@/store/useAuthStore'

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
    <QueryClientProvider client={queryClient}>
      <SessionInit />
      {children}
    </QueryClientProvider>
  )
}
