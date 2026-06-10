'use client'

import { XCircle, CheckCircle2 } from 'lucide-react'

const PAIN_POINTS = [
  {
    before: 'Switching between 6+ job portals, missing opportunities',
    after:  'One search returns jobs from LinkedIn, Naukri, Indeed, Glassdoor & more — simultaneously',
  },
  {
    before: 'Resume rejected silently by ATS before a human ever reads it',
    after:  'AI scores your resume against ATS criteria and tells you exactly what to fix',
  },
  {
    before: 'No idea where your applications stand — endless follow-up anxiety',
    after:  'Dashboard tracks every application: Applied → In Review → Interview → Offer',
  },
  {
    before: 'Job search tools cost money — paid plans just to apply',
    after:  'Everything on JobQuest is free: search, save, score, post and track',
  },
]

export function PainSolution() {
  return (
    <section style={{ padding: '100px 24px', background: '#0A1628' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="sec-label">Why JobQuest</div>
          <h2 className="sec-title">
            Say goodbye to job search{' '}
            <span style={{ background: 'linear-gradient(90deg,#F87171,#FB923C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              frustration
            </span>
          </h2>
          <p className="sec-sub">We built JobQuest to solve every pain point job seekers face in India.</p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 16 }}>
          {PAIN_POINTS.map(({ before, after }, i) => (
            <div key={i} style={{
              background: '#0F2044',
              border: '1px solid #1E3A5F',
              borderRadius: 20,
              padding: '28px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,201,177,0.35)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 40px rgba(0,201,177,0.08)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#1E3A5F'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
              }}
            >
              {/* Before */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <XCircle size={14} color="#F87171" />
                </div>
                <p style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.65, margin: 0 }}>{before}</p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#1E3A5F', margin: '0 0 16px' }} />

              {/* After */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,201,177,0.12)', border: '1px solid rgba(0,201,177,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={14} color="#00C9B1" />
                </div>
                <p style={{ fontSize: 14, color: '#F0F4FF', lineHeight: 1.65, margin: 0 }}>{after}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
