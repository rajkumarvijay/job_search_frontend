'use client'

import { useState } from 'react'
import { MapPin, Clock, ExternalLink, Bookmark, BookmarkCheck, IndianRupee, Briefcase } from 'lucide-react'
import { SourceBadge } from './SourceBadge'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { formatSalary, timeAgo } from '@/lib/utils'
import type { JobResult } from '@/types'

// Safe truncate — never throws
function safeTruncate(str: unknown, max: number): string {
  const s = String(str ?? '')
  return s.length <= max ? s : s.slice(0, max) + '…'
}

interface Props { job: JobResult }

export function JobCard({ job }: Props) {
  const [hovered, setHovered] = useState(false)
  const { isSaved, saveJob, removeJob } = useSavedJobs()
  const saved = isSaved(job?.job_id ?? '')

  // All values defensively coerced
  const title    = job?.title    || 'Untitled'
  const company  = job?.company  || 'Unknown'
  const location = job?.location || ''
  const platform = job?.platform || ''
  const jobUrl   = job?.job_url  || ''
  const desc     = job?.description || ''
  const salary   = formatSalary(job?.min_salary, job?.max_salary, job?.salary_currency ?? 'INR', job?.salary_interval)
  const posted   = timeAgo(job?.date_posted)
  const showSalary = salary !== 'Salary not disclosed'

  if (!job?.job_id) return null   // skip malformed entries entirely

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0F2044',
        border: `1px solid ${hovered ? 'rgba(0,201,177,0.3)' : '#1E3A5F'}`,
        borderRadius: 16,
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 8px 32px rgba(0,201,177,0.08)' : 'none',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{
            fontWeight: 700, fontSize: 15,
            color: hovered ? '#00C9B1' : '#F0F4FF',
            lineHeight: 1.35, marginBottom: 4,
            transition: 'color 0.18s',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Briefcase size={11} color="#8B9DC3" />
            <span style={{ fontSize: 13, color: '#8B9DC3', fontWeight: 500 }}>{company}</span>
          </div>
        </div>

        <button
          onClick={() => saved ? removeJob(job.job_id) : saveJob(job)}
          title={saved ? 'Remove' : 'Save job'}
          style={{
            flexShrink: 0, width: 34, height: 34, borderRadius: 9,
            background: saved ? 'rgba(0,201,177,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${saved ? 'rgba(0,201,177,0.3)' : '#1E3A5F'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.18s',
          }}
        >
          {saved
            ? <BookmarkCheck size={15} color="#00C9B1" />
            : <Bookmark size={15} color="#8B9DC3" />
          }
        </button>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {location ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8B9DC3' }}>
            <MapPin size={11} />
            {location}
            {job.is_remote && <span style={{ color: '#00C9B1', fontWeight: 600 }}> · Remote</span>}
          </span>
        ) : null}

        {showSalary && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#4ADE80', fontWeight: 500 }}>
            <IndianRupee size={11} />
            {salary}
          </span>
        )}

        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8B9DC3' }}>
          <Clock size={11} />
          {posted}
        </span>

        {job.job_type ? (
          <span style={{
            padding: '2px 7px', borderRadius: 5,
            fontSize: 11, color: '#8B9DC3',
            background: 'rgba(30,58,95,0.6)', border: '1px solid #1E3A5F',
          }}>
            {job.job_type}
          </span>
        ) : null}
      </div>

      {/* Description */}
      {desc ? (
        <p style={{ fontSize: 13, color: '#8B9DC3', lineHeight: 1.6, margin: 0 }}>
          {safeTruncate(desc, 140)}
        </p>
      ) : null}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
        <SourceBadge platform={platform} />
        {jobUrl ? (
          <a
            href={jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: '#00C9B1', textDecoration: 'none' }}
          >
            Apply Now <ExternalLink size={12} />
          </a>
        ) : null}
      </div>
    </div>
  )
}
