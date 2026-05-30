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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Bookmark size={20} color="#00C9B1" />
        </div>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 24, color: '#F0F4FF', margin: 0 }}>Saved Jobs</h1>
          <p style={{ fontSize: 14, color: '#8B9DC3', margin: 0 }}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </p>
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: 16 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={{
              height: 160, borderRadius: 16, background: '#0F2044',
              border: '1px solid #1E3A5F',
              animation: 'pulse 2s ease-in-out infinite',
              animationDelay: `${i * 120}ms`,
            }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && savedJobs.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '80px 0', textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, marginBottom: 20,
            background: '#0F2044', border: '1px solid #1E3A5F',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bookmark size={28} color="#8B9DC3" />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: '#F0F4FF', marginBottom: 10 }}>
            No saved jobs yet
          </h2>
          <p style={{ fontSize: 14, color: '#8B9DC3', marginBottom: 28, maxWidth: 280 }}>
            Click the bookmark icon on any job card to save it here.
          </p>
          <Link
            href="/search"
            className="jq-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Search size={16} />
            Find Jobs
          </Link>
        </div>
      )}

      {/* Job grid */}
      {!isLoading && savedJobs.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: 16 }}>
          {savedJobs.map(job => (
            <JobCard key={job.job_id} job={toJobResult(job)} />
          ))}
        </div>
      )}
    </div>
  )
}
