'use client'

import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    role: 'Software Engineer',
    company: 'Hired at Razorpay',
    avatar: 'RS',
    color: '#00C9B1',
    quote: 'JobQuest saved me weeks of searching. I used to have 6 tabs open — now one search gives me everything. Got my current role through a Naukri listing I found here.',
    stars: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Product Manager',
    company: 'Hired at Flipkart',
    avatar: 'PN',
    color: '#38BDF8',
    quote: 'The resume ATS scorer was a game changer. I fixed the issues it flagged and started getting interview calls within 2 weeks. The score jumped from 52 to 89.',
    stars: 5,
  },
  {
    name: 'Arjun Mehta',
    role: 'Data Analyst',
    company: 'Hired at CRED',
    avatar: 'AM',
    color: '#A78BFA',
    quote: 'The application tracker kept me organised across 40+ applications. I could see exactly where I stood with each company — no more mental gymnastics.',
    stars: 5,
  },
  {
    name: 'Sneha Reddy',
    role: 'UI/UX Designer',
    company: 'Hired at Swiggy',
    avatar: 'SR',
    color: '#FBBF24',
    quote: 'I was surprised — everything is actually free. No hidden paywalls. Found my design role through a Google Jobs listing that showed up here. Highly recommend.',
    stars: 5,
  },
  {
    name: 'Karan Joshi',
    role: 'Backend Developer',
    company: 'Hired at PhonePe',
    avatar: 'KJ',
    color: '#4ADE80',
    quote: 'The salary filters and location search are much better than individual portals. Found remote-first roles in Bangalore I never would have discovered otherwise.',
    stars: 5,
  },
  {
    name: 'Divya Iyer',
    role: 'HR Manager',
    company: 'Posted at Meesho',
    avatar: 'DI',
    color: '#F472B6',
    quote: 'We posted a role for free and got quality applications within 48 hours. The free job posting feature is genuinely useful for startups with tight hiring budgets.',
    stars: 5,
  },
]

export function Testimonials() {
  return (
    <section style={{ padding: '100px 24px', background: '#0A1628' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="sec-label">Real stories</div>
          <h2 className="sec-title">Hear from our community</h2>
          <p className="sec-sub">Thousands of job seekers across India have found their next role with JobQuest.</p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
          {TESTIMONIALS.map(({ name, role, company, avatar, color, quote, stars }) => (
            <div key={name} style={{
              background: '#0F2044',
              border: '1px solid #1E3A5F',
              borderRadius: 20,
              padding: '28px',
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
              {/* Quote icon */}
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Quote size={14} color={color} />
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={13} color="#FBBF24" fill="#FBBF24" />
                ))}
              </div>

              {/* Quote text */}
              <p style={{ fontSize: 14, color: '#C8D6F0', lineHeight: 1.75, margin: 0, flex: 1 }}>
                &ldquo;{quote}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '1px solid #1E3A5F' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${color}cc, ${color}44)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: '#0A1628', flexShrink: 0,
                  border: `2px solid ${color}40`,
                }}>
                  {avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F0F4FF' }}>{name}</div>
                  <div style={{ fontSize: 12, color: '#4A6FA5', marginTop: 1 }}>{role} · <span style={{ color }}>{company}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
