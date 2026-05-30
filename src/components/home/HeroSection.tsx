'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Zap } from 'lucide-react'
import { POPULAR_KEYWORDS, INDIA_CITIES } from '@/lib/constants'
import { ResumeUpload } from '@/components/search/ResumeUpload'

export function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('India')
  const [focused, setFocused] = useState(false)

  const handleSearch = useCallback(() => {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}&location=${encodeURIComponent(location)}`)
  }, [query, location, router])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px 80px',
        overflow: 'hidden',
        background: '#0A1628',
      }}
    >
      {/* Dot grid */}
      <div
        className="dot-bg"
        style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}
      />
      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-60%)',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,201,177,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 860, textAlign: 'center' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 18px', borderRadius: 999,
          background: 'rgba(0,201,177,0.08)',
          border: '1px solid rgba(0,201,177,0.25)',
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
          marginBottom: 16,
        }}>
          Every Great Career
          <br />
          <span className="text-grad">Starts with a Search</span>
        </h1>

        <p style={{
          fontSize: 18,
          color: '#8B9DC3',
          maxWidth: 520,
          margin: '0 auto 44px',
          lineHeight: 1.6,
        }}>
          Search once. Get results from LinkedIn, Indeed, Glassdoor, Naukri, ZipRecruiter and Google Jobs — unified in one beautiful portal.
        </p>

        {/* Search bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
          background: '#0F2044',
          border: `1.5px solid ${focused ? '#00C9B1' : '#1E3A5F'}`,
          borderRadius: 18,
          boxShadow: focused ? '0 0 0 4px rgba(0,201,177,0.12)' : '0 4px 32px rgba(0,0,0,0.3)',
          transition: 'all 0.25s',
          overflow: 'hidden',
          maxWidth: 780,
          margin: '0 auto',
        }}>
          {/* Query input */}
          <div style={{
            flex: '1 1 260px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 20px',
            borderRight: '1px solid #1E3A5F',
            minHeight: 64,
          }}>
            <Search size={18} color="#00C9B1" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Job title, skills or keywords..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F0F4FF',
                fontSize: 16,
              }}
            />
          </div>
          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 18px',
            borderRight: '1px solid #1E3A5F',
            minHeight: 64,
            minWidth: 160,
          }}>
            <MapPin size={15} color="#8B9DC3" />
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F0F4FF',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {INDIA_CITIES.map(c => (
                <option key={c} value={c} style={{ background: '#0F2044' }}>{c}</option>
              ))}
            </select>
          </div>
          {/* Resume upload + Search button row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 8, flexShrink: 0 }}>
            <ResumeUpload />
            <button
              onClick={handleSearch}
              className="jq-btn"
              style={{ borderRadius: 12, fontSize: 15, padding: '0 22px', minHeight: 48 }}
            >
              <Search size={16} />
              Search Jobs
            </button>
          </div>
        </div>

        {/* Quick keywords */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
          marginTop: 28,
        }}>
          <span style={{ fontSize: 13, color: '#8B9DC3', alignSelf: 'center', marginRight: 4 }}>Popular:</span>
          {POPULAR_KEYWORDS.slice(0, 7).map(kw => (
            <button
              key={kw}
              onClick={() => router.push(`/search?q=${encodeURIComponent(kw)}&location=India`)}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid #1E3A5F',
                background: 'rgba(255,255,255,0.03)',
                color: '#8B9DC3',
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#00C9B1'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#00C9B1'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#1E3A5F'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#8B9DC3'
              }}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        color: '#8B9DC3', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
        animation: 'float 2.5s ease-in-out infinite',
      }}>
        <div style={{
          width: 20, height: 32, borderRadius: 10,
          border: '1.5px solid #1E3A5F',
          display: 'flex', justifyContent: 'center', paddingTop: 5,
        }}>
          <div style={{ width: 4, height: 8, borderRadius: 2, background: '#00C9B1', opacity: 0.8 }} />
        </div>
        Scroll
      </div>
    </section>
  )
}
