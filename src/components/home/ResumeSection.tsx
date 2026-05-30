'use client'

import { Target, TrendingUp, Layout, Edit3 } from 'lucide-react'
import { RESUME_TIPS } from '@/lib/constants'

const ICONS: Record<string, React.ElementType> = {
  target: Target, 'trending-up': TrendingUp, layout: Layout, 'edit-3': Edit3,
}

const PALETTES = [
  { from: 'rgba(0,201,177,0.1)',   accent: '#00C9B1', border: 'rgba(0,201,177,0.2)' },
  { from: 'rgba(167,139,250,0.1)', accent: '#A78BFA', border: 'rgba(167,139,250,0.2)' },
  { from: 'rgba(251,191,36,0.1)',  accent: '#FBBF24', border: 'rgba(251,191,36,0.2)' },
  { from: 'rgba(74,222,128,0.1)',  accent: '#4ADE80', border: 'rgba(74,222,128,0.2)' },
]

export function ResumeSection() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="sec-label">Get more callbacks</div>
        <h2 className="sec-title">Resume Suggestions</h2>
        <p className="sec-sub">Small tweaks that have a massive impact on interview invites</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
          {RESUME_TIPS.map((tip, i) => {
            const pal = PALETTES[i]
            const Icon = ICONS[tip.icon]
            return (
              <div key={tip.title} style={{
                padding: 28, borderRadius: 18,
                background: `linear-gradient(135deg, ${pal.from} 0%, rgba(15,32,68,0.8) 100%)`,
                border: `1px solid ${pal.border}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = `0 16px 40px ${pal.accent}18`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 20,
                  background: `${pal.accent}18`,
                  border: `1px solid ${pal.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {Icon && <Icon size={22} color={pal.accent} />}
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#F0F4FF', marginBottom: 10, letterSpacing: '-0.01em' }}>
                  {tip.title}
                </div>
                <div style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.65 }}>
                  {tip.desc}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
