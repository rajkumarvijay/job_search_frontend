import { useQuery } from '@tanstack/react-query'
import { trendingApi } from '@/lib/api'
import type { TrendingRole, SalaryBand, TrendingKeyword, StatsResponse } from '@/types'

export function useTrendingRoles() {
  return useQuery<TrendingRole[]>({
    queryKey: ['trending', 'roles'],
    queryFn: async () => (await trendingApi.roles()).data,
    staleTime: 30 * 60 * 1000,
  })
}

export function useSalaryBands() {
  return useQuery<SalaryBand[]>({
    queryKey: ['trending', 'salary-bands'],
    queryFn: async () => (await trendingApi.salaryBands()).data,
    staleTime: 60 * 60 * 1000,
  })
}

export function useTrendingKeywords() {
  return useQuery<TrendingKeyword[]>({
    queryKey: ['trending', 'keywords'],
    queryFn: async () => (await trendingApi.keywords()).data,
    staleTime: 30 * 60 * 1000,
  })
}

export function usePortalStats() {
  return useQuery<StatsResponse>({
    queryKey: ['trending', 'stats'],
    queryFn: async () => (await trendingApi.stats()).data,
    staleTime: 30 * 60 * 1000,
  })
}
