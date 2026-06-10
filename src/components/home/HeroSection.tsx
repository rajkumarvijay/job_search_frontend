'use client'

import { Zap, TrendingUp } from 'lucide-react'

const TRENDING_ROW_1 = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer',
  'React Developer', 'Machine Learning', 'UI/UX Designer', 'Full Stack Developer',
  'Cloud Architect', 'Cybersecurity Analyst', 'Business Analyst', 'Scrum Master',
  'Android Developer', 'iOS Developer', 'Node.js Developer', 'Python Developer',
]

const TRENDING_ROW_2 = [
  'Digital Marketing', 'Data Engineer', 'Java Developer', 'Salesforce Admin',
  'HR Manager', 'Finance Analyst', 'Content Writer', 'QA Engineer',
  'Solution Architect', 'Blockchain Developer', 'AI/ML Engineer', 'SAP Consultant',
  'Technical Writer', 'Operations Manager', 'Growth Hacker', 'SEO Specialist',
]

const COLORS = ['#00C9B1', '#38BDF8', '#A78BFA', '#FBBF24', '#4ADE80', '#F472B6', '#FB923C', '#67E8F9']

function TrendingMarquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div style={{
        display: 'flex',
        gap: 10,
        width: 'max-content',
        animation: `marquee ${reverse ? '28s' : '22s'} linear infinite ${reverse ? 'reverse' : ''}`,
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            flexShrink: 0,
            padding: '7px 16px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #1E3A5F',
            color: COLORS[i % COLORS.length],
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 0 80px',
        overflow: 'hidden',
        background: '#0A1628',
      }}
    >
      {/* Dot grid */}
      <div className="dot-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-60%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,201,177,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Text content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 860, textAlign: 'center', padding: '0 24px' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 18px', borderRadius: 999,
          background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)',
          color: '#00C9B1', fontSize: 13, fontWeight: 600, marginBottom: 32,
        }}>
          <Zap size={13} fill="#00C9B1" />
          Live jobs from 6 portals · LinkedIn · Naukri · Indeed · Glassdoor
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: '#F0F4FF',
          marginBottom: 20,
        }}>
          Every Great Career
          <br />
          <span className="text-grad">Starts with a Search</span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: 18, color: '#8B9DC3',
          maxWidth: 520, margin: '0 auto 52px',
          lineHeight: 1.6,
        }}>
          Search once. Get results from LinkedIn, Indeed, Glassdoor, Naukri, ZipRecruiter and Google Jobs — unified in one beautiful portal.
        </p>

      </div>

      {/* Trending keywords — full width marquees */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>

        {/* Section label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 7, marginBottom: 20,
          fontSize: 12, fontWeight: 700, color: '#4A6FA5',
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          <TrendingUp size={13} color="#4A6FA5" /> Trending job titles in India right now
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TrendingMarquee items={TRENDING_ROW_1} />
          <TrendingMarquee items={TRENDING_ROW_2} reverse />
        </div>
      </div>

    </section>
  )
}
