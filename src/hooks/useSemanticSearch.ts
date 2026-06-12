import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api'
import type { JobResult } from '@/types'

interface SemanticResult {
  query: string
  location: string
  total: number
  jobs: JobResult[]
  mode: 'semantic'
}

interface SemanticParams {
  q: string
  location?: string
  limit?: number
}

export function useSemanticSearch(params: SemanticParams, enabled = true) {
  return useQuery<SemanticResult>({
    queryKey: ['semantic-jobs', params],
    queryFn: async () => {
      const { data } = await jobsApi.semanticSearch(params)
      return data
    },
    enabled: enabled && !!params.q,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
