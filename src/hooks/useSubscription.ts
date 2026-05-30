'use client'

import { useQuery } from '@tanstack/react-query'
import { paymentApi } from '@/lib/api'

interface SubscriptionStatus {
  plan_code: string
  status: string
  current_period_end: string | null
  is_active: boolean
}

export function useSubscription() {
  return useQuery<SubscriptionStatus>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data } = await paymentApi.subscription()
      return data
    },
    staleTime: 60 * 1000,
    retry: 1,
  })
}
