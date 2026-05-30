'use client'

import { useState } from 'react'
import { MapPin, Clock, ExternalLink, Bookmark, BookmarkCheck, IndianRupee, Briefcase } from 'lucide-react'
import { SourceBadge } from './SourceBadge'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { formatSalary, timeAgo, truncate } from '@/lib/utils'
import type { JobResult } from '@/types'

interface Props { job: JobResult }

export function JobCard({ job }: Props) {
  const { isSaved, saveJob, removeJob } = useSavedJobs()
  const [hovered, setHovered] = useState(false)
  const saved = isSaved(job.job_id)

  const salary = formatSalary(job.min_salary, job.max_salary, job.salary_currency, job.salary_interval)
  const showSalary = salary !== 'Salary not disclosed'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0F2044',
        border: `1px solid ${hovered ? 'rgba(0,201,177,0.3)' : '#1E3A5F'}`,
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 8px 32px rgba(0,201,177,0.08)' : 'none',
        cursor: 'default',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{
            fontWeight: 700,
            fontSize: 16,
            color: hovered ? '#00C9B1' : '#F0F4FF',
            lineHeight: 1.35,
            marginBottom: 4,
            transition: 'color 0.18s',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {job.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Briefcase size={12} color="#8B9DC3" />
            <span style={{ fontSize: 14, color: '#8B9DC3', fontWeight: 500 }}>{job.company}</span>
          </div>
        </div>
        <button
          onClick={() => saved ? removeJob(job.job_id) : saveJob(job)}
          title={saved ? 'Remove saved' : 'Save job'}
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            borderRadius: 10,
            background: saved ? 'rgba(0,201,177,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${saved ? 'rgba(0,201,177,0.3)' : '#1E3A5F'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.18s',
            color: saved ? '#00C9B1' : '#8B9DC3',
          }}
        >
          {saved
            ? <BookmarkCheck size={16} color="#00C9B1" />
            : <Bookmark size={16} color="#8B9DC3" />
          }
        </button>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        {job.location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8B9DC3' }}>
            <MapPin size={12} />
            {job.location}
            {job.is_remote && <span style={{ color: '#00C9B1', fontWeight: 600 }}>· Remote</span>}
          </span>
        )}
        {showSalary && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4ADE80', fontWeight: 500 }}>
            <IndianRupee size={12} />
            {salary}
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8B9DC3' }}>
          <Clock size={12} />
          {timeAgo(job.date_posted)}
        </span>
        {job.job_type && (
          <span style={{ padding: '2px 8px', borderRadius: 5, fontSize: 11, color: '#8B9DC3', background: 'rgba(30,58,95,0.6)', border: '1px solid #1E3A5F' }}>
            {job.job_type}
          </span>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <p style={{ fontSize: 13, color: '#8B9DC3', lineHeight: 1.65, margin: 0 }}>
          {truncate(job.description, 140)}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
        <SourceBadge platform={job.platform} />
        {job.job_url && (
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 13,
              fontWeight: 600,
              color: '#00C9B1',
              textDecoration: 'none',
            }}
          >
            Apply Now
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  )
}
