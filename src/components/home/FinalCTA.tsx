'use client'

import Link from 'next/link'
import { Search, ArrowRight, Zap } from 'lucide-react'

export function FinalCTA() {
  return (
    <section style={{ padding: '100px 24px', background: '#080F1E' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>

        {/* Glow orb */}
        <div style={{
          position: 'relative',
          display: 'inline-block',
          marginBottom: 32,
        }}>
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,201,177,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'relative',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 18px', borderRadius: 999,
            background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)',
            color: '#00C9B1', fontSize: 13, fontWeight: 600,
          }}>
            <Zap size={13} fill="#00C9B1" /> Start for free — no account needed to search
          </div>
        </div>

        <h2 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 900,
          letterSpacing: '-0.035em',
          color: '#F0F4FF',
          lineHeight: 1.1,
          marginBottom: 20,
        }}>
          Your next job is{' '}
          <span style={{ background: 'linear-gradient(90deg,#00C9B1,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            one search away
          </span>
        </h2>

        <p style={{ fontSize: 18, color: '#8B9DC3', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 44px' }}>
          Join 50,000+ job seekers who use JobQuest to search smarter, apply faster, and land their dream role.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/search" style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            padding: '16px 32px', borderRadius: 16, textDecoration: 'none',
            background: '#00C9B1', color: '#0A1628',
            fontSize: 16, fontWeight: 800,
            boxShadow: '0 0 32px rgba(0,201,177,0.3)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#00B09D'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#00C9B1'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
          >
            <Search size={18} /> Search Jobs Now
          </Link>

          <Link href="/resume" style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            padding: '16px 32px', borderRadius: 16, textDecoration: 'none',
            background: 'transparent', color: '#F0F4FF',
            border: '1.5px solid #1E3A5F',
            fontSize: 16, fontWeight: 700,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#4A6FA5'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1E3A5F'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
          >
            Score My Resume <ArrowRight size={16} />
          </Link>
        </div>

        {/* Trust footnote */}
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {['No sign-up required', 'Completely free', '6 portals in 1 search'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4A6FA5' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00C9B1' }} />
              {t}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
