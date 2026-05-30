'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { savedApi } from '@/lib/api'
import type { JobResult, SavedJob } from '@/types'

// ─── Single shared query key ───────────────────────────────────────────────
const QUERY_KEY = ['saved-jobs']

// ─── useSavedJobs ─────────────────────────────────────────────────────────
// Safe to call in many components simultaneously:
// - TanStack Query deduplicates the network request (only 1 API call)
// - isSaved is computed from query data directly — NO Zustand store, NO useEffect
// - No Zustand setSavedIds means no cascade of store updates across 30+ cards
export function useSavedJobs() {
  const qc = useQueryClient()

  const { data: savedJobs = [], isLoading } = useQuery<SavedJob[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await savedApi.get()
      return Array.isArray(data) ? data : []
    },
    staleTime: 60 * 1000,
    retry: 1,
  })

  // Compute isSaved from cached query data — no Zustand, no useEffect, no loops
  const savedIds = new Set(savedJobs.map(j => j.job_id))
  const isSaved = (jobId: string) => savedIds.has(jobId)

  const saveMutation = useMutation({
    mutationFn: (job: JobResult) =>
      savedApi.save({
        job_id:          job.job_id,
        title:           job.title,
        company:         job.company,
        location:        job.location,
        min_salary:      job.min_salary,
        max_salary:      job.max_salary,
        salary_currency: job.salary_currency ?? 'INR',
        job_url:         job.job_url,
        platform:        job.platform,
        description:     job.description,
        date_posted:     job.date_posted,
      }),
    // Optimistic update: immediately add to local cache without waiting for API
    onMutate: async (job: JobResult) => {
      await qc.cancelQueries({ queryKey: QUERY_KEY })
      const previous = qc.getQueryData<SavedJob[]>(QUERY_KEY) ?? []
      const optimistic: SavedJob = {
        id: -Date.now(),
        session_id: '',
        job_id:          job.job_id,
        title:           job.title,
        company:         job.company,
        location:        job.location,
        min_salary:      job.min_salary,
        max_salary:      job.max_salary,
        salary_currency: job.salary_currency ?? 'INR',
        job_url:         job.job_url,
        platform:        job.platform,
        description:     job.description,
        date_posted:     job.date_posted,
        saved_at:        new Date().toISOString(),
      }
      qc.setQueryData<SavedJob[]>(QUERY_KEY, [...previous, optimistic])
      return { previous }
    },
    onError: (_err, _job, context) => {
      // Rollback on failure
      if (context?.previous) qc.setQueryData(QUERY_KEY, context.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const removeMutation = useMutation({
    mutationFn: (jobId: string) => savedApi.remove(jobId),
    // Optimistic update: immediately remove from local cache
    onMutate: async (jobId: string) => {
      await qc.cancelQueries({ queryKey: QUERY_KEY })
      const previous = qc.getQueryData<SavedJob[]>(QUERY_KEY) ?? []
      qc.setQueryData<SavedJob[]>(QUERY_KEY, previous.filter(j => j.job_id !== jobId))
      return { previous }
    },
    onError: (_err, _jobId, context) => {
      if (context?.previous) qc.setQueryData(QUERY_KEY, context.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  return {
    savedJobs,
    isLoading,
    isSaved,
    saveJob:   saveMutation.mutate,
    removeJob: removeMutation.mutate,
  }
}
