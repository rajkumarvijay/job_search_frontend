'use client'

import { Loader2, SearchX } from 'lucide-react'
import { JobCard } from './JobCard'
import type { JobResult } from '@/types'

function SkeletonCard() {
  return (
    <div style={{
      background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 16, padding: 24,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {[['75%', 14], ['50%', 12], ['100%', 10], ['85%', 10]].map(([w, h], i) => (
        <div key={i} style={{
          width: w as string, height: h as number,
          borderRadius: 6, background: 'rgba(30,58,95,0.6)',
          animation: 'pulse 2s ease-in-out infinite',
          animationDelay: `${i * 150}ms`,
        }} />
      ))}
    </div>
  )
}

interface Props { jobs: JobResult[]; isLoading: boolean; error: Error | null; query: string }

export function JobGrid({ jobs, isLoading, error, query }: Props) {
  if (isLoading) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: '#8B9DC3', fontSize: 14 }}>
          <Loader2 size={16} color="#00C9B1" style={{ animation: 'spin 1s linear infinite' }} />
          Searching across 6 portals for &ldquo;{query}&rdquo;… may take a few seconds
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16 }}>
          {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 20px',
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SearchX size={28} color="#F87171" />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 18, color: '#F0F4FF', marginBottom: 8 }}>Search failed</h3>
        <p style={{ fontSize: 14, color: '#8B9DC3', marginBottom: 6 }}>The backend may be starting up. Try again in a moment.</p>
        <p style={{ fontSize: 12, color: 'rgba(248,113,113,0.5)' }}>{error.message}</p>
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
        <p style={{ fontSize: 14, color: '#8B9DC3' }}>Try different keywords, broader location, or fewer filters.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16 }}>
      {jobs.map(job => <JobCard key={job.job_id} job={job} />)}
    </div>
  )
}
