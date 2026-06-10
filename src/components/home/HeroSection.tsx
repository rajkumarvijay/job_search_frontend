'use client'

import { Zap } from 'lucide-react'

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
        padding: '80px 24px 80px',
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
          marginBottom: 24,
        }}>
          Every Great Career
          <br />
          <span className="text-grad">Starts with a Search</span>
        </h1>

        <p style={{
          fontSize: 18,
          color: '#8B9DC3',
          maxWidth: 520,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Search once. Get results from LinkedIn, Indeed, Glassdoor, Naukri, ZipRecruiter and Google Jobs — unified in one beautiful portal.
        </p>
      </div>

    </section>
  )
}
