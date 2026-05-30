'use client'

import { useRouter } from 'next/navigation'
import { Hash, TrendingUp } from 'lucide-react'
import { useTrendingKeywords } from '@/hooks/useTrending'
import { POPULAR_KEYWORDS } from '@/lib/constants'

export function PopularKeywords() {
  const router = useRouter()
  const { data: keywords } = useTrendingKeywords()
  const items = keywords?.map(k => k.keyword) ?? POPULAR_KEYWORDS

  return (
    <section style={{ padding: '80px 24px', background: 'rgba(15,32,68,0.3)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <div className="sec-label">What recruiters want</div>
            <h2 className="sec-title">Popular Search Keywords</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8B9DC3', fontSize: 13, padding: '8px 14px', background: 'rgba(0,201,177,0.06)', borderRadius: 10, border: '1px solid rgba(0,201,177,0.15)' }}>
            <TrendingUp size={14} color="#00C9B1" />
            Updated daily from live job data
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {items.map((kw, i) => (
            <button
              key={kw}
              onClick={() => router.push(`/search?q=${encodeURIComponent(kw)}&location=India`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 18px',
                borderRadius: 10,
                fontSize: 14, fontWeight: 500,
                border: '1px solid #1E3A5F',
                background: 'rgba(255,255,255,0.02)',
                color: '#8B9DC3',
                cursor: 'pointer',
                transition: 'all 0.18s',
                animationDelay: `${i * 30}ms`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = '#00C9B1'
                el.style.color = '#00C9B1'
                el.style.background = 'rgba(0,201,177,0.06)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = '#1E3A5F'
                el.style.color = '#8B9DC3'
                el.style.background = 'rgba(255,255,255,0.02)'
              }}
            >
              <Hash size={13} color="#00C9B1" />
              {kw}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
