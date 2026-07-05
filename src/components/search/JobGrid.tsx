'use client'

import { Loader2, SearchX } from 'lucide-react'
import { JobCard } from './JobCard'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { JobResult } from '@/types'

function SkeletonCard() {
  return (
    <div style={{
      background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 16, padding: 22,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {([['75%', 14], ['50%', 12], ['100%', 10], ['85%', 10]] as [string, number][]).map(([w, h], i) => (
        <div key={i} style={{
          width: w, height: h, borderRadius: 6,
          background: 'rgba(30,58,95,0.6)',
          opacity: 1 - i * 0.15,
        }} />
      ))}
    </div>
  )
}

interface Props { jobs: JobResult[]; isLoading: boolean; error: Error | null; query: string; mode?: 'keyword' | 'smart' }

export function JobGrid({ jobs, isLoading, error, query, mode = 'keyword' }: Props) {
  if (isLoading) {
    return (
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 20, color: '#8B9DC3', fontSize: 14,
        }}>
          <Loader2 size={15} color="#00C9B1" className="animate-spin" />
          {mode === 'smart'
            ? <>Finding semantic matches for &ldquo;{query}&rdquo;… may take up to 30s on first search</>
            : <>Searching 6 portals for &ldquo;{query}&rdquo;… this takes a few seconds</>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
          {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  if (error) {
    const msg = (error?.message ?? '').toString()
    const isCors = msg.includes('Network Error') || msg.includes('network') || msg === ''

    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 20px',
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SearchX size={28} color="#F87171" />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 18, color: '#F0F4FF', marginBottom: 10 }}>
          {isCors ? 'Cannot reach backend' : 'Search failed'}
        </h3>
        {isCors ? (
          <p style={{ fontSize: 14, color: '#8B9DC3', maxWidth: 400, margin: '0 auto' }}>
            The backend may be waking up (free tier sleeps after inactivity). Wait 30 seconds and try again. If it keeps failing, check that <code style={{ color: '#38BDF8' }}>NEXT_PUBLIC_API_URL</code> ends with <code style={{ color: '#38BDF8' }}>/api/v1</code> in Vercel.
          </p>
        ) : (
          <p style={{ fontSize: 14, color: '#8B9DC3' }}>
            The search API returned an error. Try again in a moment.
          </p>
        )}
        {msg ? <p style={{ fontSize: 11, color: 'rgba(248,113,113,0.4)', marginTop: 10 }}>{msg}</p> : null}
      </div>
    )
  }

  if (jobs.length === 0 && query) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 20px',
          background: 'rgba(30,58,95,0.4)', border: '1px solid #1E3A5F',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SearchX size={28} color="#8B9DC3" />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 18, color: '#F0F4FF', marginBottom: 8 }}>No results found</h3>
        <p style={{ fontSize: 14, color: '#8B9DC3' }}>
          Try different keywords, a broader location, or fewer filters.
        </p>
      </div>
    )
  }

  // Filter out any null/malformed entries before rendering
  const validJobs = jobs.filter(j => j && j.job_id && j.title)

  return (
    <ErrorBoundary>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
        {validJobs.map(job => (
          <ErrorBoundary key={job.job_id} fallback={null}>
            <JobCard job={job} />
          </ErrorBoundary>
        ))}
      </div>
    </ErrorBoundary>
  )
}
