'use client'

import { useCallback, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { savedApi } from '@/lib/api'
import { useAppStore } from '@/store/useAppStore'
import type { JobResult, SavedJob } from '@/types'

export function useSavedJobs() {
  const { setSavedIds, addSavedId, removeSavedId, savedJobIds } = useAppStore()
  const qc = useQueryClient()

  const { data: savedJobs = [], isLoading } = useQuery<SavedJob[]>({
    queryKey: ['saved-jobs'],
    queryFn: async () => (await savedApi.get()).data,
    staleTime: 60 * 1000,
  })

  useEffect(() => {
    setSavedIds(savedJobs.map((j) => j.job_id))
  }, [savedJobs, setSavedIds])

  const saveMutation = useMutation({
    mutationFn: (job: JobResult) =>
      savedApi.save({
        job_id: job.job_id,
        title: job.title,
        company: job.company,
        location: job.location,
        min_salary: job.min_salary,
        max_salary: job.max_salary,
        salary_currency: job.salary_currency ?? 'INR',
        job_url: job.job_url,
        platform: job.platform,
        description: job.description,
        date_posted: job.date_posted,
      }),
    onMutate: async (job) => {
      addSavedId(job.job_id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-jobs'] }),
    onError: (_err, job) => removeSavedId(job.job_id),
  })

  const removeMutation = useMutation({
    mutationFn: (jobId: string) => savedApi.remove(jobId),
    onMutate: async (jobId) => {
      removeSavedId(jobId)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-jobs'] }),
    onError: (_err, jobId) => addSavedId(jobId),
  })

  const isSaved = useCallback((jobId: string) => savedJobIds.has(jobId), [savedJobIds])

  return {
    savedJobs,
    isLoading,
    isSaved,
    saveJob: saveMutation.mutate,
    removeJob: removeMutation.mutate,
  }
}
