'use client'

import Link from 'next/link'
import { Zap, Search, FileText } from 'lucide-react'

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
        padding: '80px 0',
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
          maxWidth: 520, margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          Search once. Get results from LinkedIn, Indeed, Glassdoor, Naukri, ZipRecruiter and Google Jobs — unified in one beautiful portal.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/search" style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            padding: '16px 32px', borderRadius: 14, textDecoration: 'none',
            background: '#00C9B1', color: '#0A1628',
            fontSize: 16, fontWeight: 800,
            boxShadow: '0 0 28px rgba(0,201,177,0.35)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#00B09D'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#00C9B1'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
          >
            <Search size={18} /> Search Jobs — It&apos;s Free
          </Link>
          <Link href="/resume" style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            padding: '16px 32px', borderRadius: 14, textDecoration: 'none',
            background: 'transparent', color: '#F0F4FF',
            border: '1.5px solid #1E3A5F', fontSize: 16, fontWeight: 700,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#4A6FA5'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1E3A5F'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
          >
            <FileText size={17} /> Score My Resume
          </Link>
        </div>

      </div>

    </section>
  )
}
