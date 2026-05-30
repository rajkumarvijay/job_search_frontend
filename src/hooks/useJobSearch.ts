import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api'
import type { SearchResponse } from '@/types'

interface SearchParams {
  q: string
  location?: string
  platforms?: string
  results_per_site?: number
  page?: number
}

export function useJobSearch(params: SearchParams, enabled = true) {
  return useQuery<SearchResponse>({
    queryKey: ['jobs', params],
    queryFn: async () => {
      const { data } = await jobsApi.search(params)
      return data
    },
    enabled: enabled && !!params.q,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
