'use client'

import Link from 'next/link'
import { Target, FileText, BarChart2, PlusCircle, ArrowRight } from 'lucide-react'

const FEATURES = [
  {
    icon: Target,
    color: '#00C9B1',
    badge: 'AI Powered',
    title: 'Job Match Score',
    desc: 'Instantly find out how well your resume matches any job description — before you apply. Know your score, gaps, and exactly what to fix.',
    bullets: ['0–100 match score in seconds', 'Matched & missing skills breakdown', 'Personalised learning recommendations'],
    href: '/job-match',
    cta: 'Check My Match',
  },
  {
    icon: FileText,
    color: '#38BDF8',
    badge: 'AI Powered',
    title: 'Resume ATS Scorer',
    desc: 'Upload your resume and our AI model scores it on ATS compatibility — keyword density, structure, formatting — and gives you a prioritised fix list.',
    bullets: ['0–100 ATS score instantly', 'Keyword & section analysis', 'Actionable improvement tips'],
    href: '/resume',
    cta: 'Score My Resume',
  },
  {
    icon: BarChart2,
    color: '#A78BFA',
    badge: 'Dashboard',
    title: 'Application Tracker',
    desc: 'Never lose track of a job application again. Visualise your pipeline in a Kanban board — from Applied to Offer — right in your dashboard.',
    bullets: ['5-stage Kanban pipeline', 'Interview scheduler built-in', 'Search analytics & insights'],
    href: '/dashboard',
    cta: 'Open Dashboard',
  },
  {
    icon: PlusCircle,
    color: '#FBBF24',
    badge: 'For Employers',
    title: 'Free Job Posting',
    desc: 'Post a job listing for free and reach thousands of active job seekers. Manage all your listings from one place with no sign-up required.',
    bullets: ['Zero cost to post', 'Visible to 50,000+ seekers', 'Edit or delete anytime'],
    href: '/post-job',
    cta: 'Post a Job',
  },
]

export function FeaturesShowcase() {
  return (
    <section style={{ padding: '100px 24px', background: '#080F1E' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="sec-label">Everything you need</div>
          <h2 className="sec-title">All your job search tools in one place</h2>
          <p className="sec-sub">No more juggling tabs. JobQuest brings together every tool a modern job seeker needs.</p>
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 20 }}>
          {FEATURES.map(({ icon: Icon, color, badge, title, desc, bullets, href, cta }) => (
            <div key={title} style={{
              background: '#0F2044',
              border: '1px solid #1E3A5F',
              borderRadius: 24,
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              transition: 'all 0.25s',
              position: 'relative',
              overflow: 'hidden',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = `${color}55`
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = `0 16px 48px ${color}12`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = '#1E3A5F'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              {/* Top glow accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, ${color}44)`, borderRadius: '24px 24px 0 0' }} />

              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 999, marginBottom: 20,
                background: `${color}12`, border: `1px solid ${color}30`,
                fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em',
                alignSelf: 'flex-start',
              }}>
                {badge}
              </div>

              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 16, marginBottom: 20,
                background: `${color}15`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={24} color={color} />
              </div>

              {/* Title + desc */}
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F0F4FF', letterSpacing: '-0.02em', margin: '0 0 10px' }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.7, margin: '0 0 20px' }}>{desc}</p>

              {/* Bullets */}
              <ul style={{ margin: '0 0 28px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bullets.map(b => (
                  <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8B9DC3' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div style={{ marginTop: 'auto' }}>
                <Link href={href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '10px 20px', borderRadius: 12, textDecoration: 'none',
                  background: `${color}12`, border: `1.5px solid ${color}35`,
                  color, fontSize: 14, fontWeight: 700, transition: 'all 0.18s',
                }}>
                  {cta} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
