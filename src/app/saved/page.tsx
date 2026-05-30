'use client'

import { Bookmark, Search } from 'lucide-react'
import Link from 'next/link'
import { JobCard } from '@/components/search/JobCard'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import type { JobResult } from '@/types'

function toJobResult(saved: ReturnType<typeof useSavedJobs>['savedJobs'][number]): JobResult {
  return {
    job_id: saved.job_id,
    title: saved.title,
    company: saved.company,
    location: saved.location,
    min_salary: saved.min_salary,
    max_salary: saved.max_salary,
    salary_currency: saved.salary_currency,
    job_url: saved.job_url,
    platform: saved.platform ?? 'unknown',
    description: saved.description,
    date_posted: saved.date_posted,
  }
}

export default function SavedPage() {
  const { savedJobs, isLoading } = useSavedJobs()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-teal" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#F0F4FF]">Saved Jobs</h1>
          <p className="text-[#8B9DC3] text-sm">
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="card p-5 h-36 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && savedJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-navy-600 flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-[#8B9DC3]" />
          </div>
          <h2 className="font-heading font-bold text-[#F0F4FF] text-xl mb-2">No saved jobs yet</h2>
          <p className="text-[#8B9DC3] text-sm mb-6 max-w-xs">
            Save jobs while browsing and come back to them anytime.
          </p>
          <Link href="/search" className="btn-primary">
            <Search className="w-4 h-4" />
            Find Jobs
          </Link>
        </div>
      )}

      {!isLoading && savedJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <JobCard key={job.job_id} job={toJobResult(job)} />
          ))}
        </div>
      )}
    </div>
  )
}
