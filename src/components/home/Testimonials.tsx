'use client'

import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    color: '#00C9B1',
    quote: 'JobQuest saved me weeks of searching. I used to have 6 tabs open — now one search gives me everything.',
    stars: 5,
  },
  {
    color: '#38BDF8',
    quote: 'The resume ATS scorer was a game changer. I fixed the issues it flagged and started getting interview calls within 2 weeks.',
    stars: 5,
  },
  {
    color: '#A78BFA',
    quote: 'The application tracker kept me organised across 40+ applications. I could see exactly where I stood with each company.',
    stars: 5,
  },
  {
    color: '#FBBF24',
    quote: 'Everything is actually free — no hidden paywalls. Found my design role through a Google Jobs listing that showed up here.',
    stars: 5,
  },
  {
    color: '#4ADE80',
    quote: 'The salary filters and location search are much better than individual portals. Found remote-first roles I never would have discovered otherwise.',
    stars: 5,
  },
  {
    color: '#F472B6',
    quote: 'We posted a role for free and got quality applications within 48 hours. Genuinely useful for startups with tight hiring budgets.',
    stars: 5,
  },
]

export function Testimonials() {
  return (
    <section style={{ padding: '100px 24px', background: '#0A1628' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="sec-label">Real stories</div>
          <h2 className="sec-title">Hear from our community</h2>
          <p className="sec-sub">Thousands of job seekers across India have found their next role with JobQuest.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
          {TESTIMONIALS.map(({ color, quote, stars }, i) => (
            <div key={i} style={{
              background: '#0F2044',
              border: '1px solid #1E3A5F',
              borderRadius: 20,
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = `${color}40`
                el.style.boxShadow = `0 8px 32px ${color}10`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = '#1E3A5F'
                el.style.boxShadow = 'none'
              }}
            >
              {/* Top accent */}
              <div style={{ width: 32, height: 4, borderRadius: 999, background: color }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: stars }).map((_, j) => (
                  <Star key={j} size={14} color="#FBBF24" fill="#FBBF24" />
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 15, color: '#C8D6F0', lineHeight: 1.75, margin: 0,
                fontStyle: 'italic',
              }}>
                &ldquo;{quote}&rdquo;
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
