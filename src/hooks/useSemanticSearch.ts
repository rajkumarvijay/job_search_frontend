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

function is503(error: unknown): boolean {
  return (error as any)?.response?.status === 503
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
    // Retry up to 5× on 503 (model warming up), once on other errors
    retry: (failureCount, error) =>
      is503(error) ? failureCount < 5 : failureCount < 1,
    // Wait 45s between 503 retries — model takes ~50s to load from disk cache
    retryDelay: (_attempt, error) => (is503(error) ? 45_000 : 1_000),
  })
}
