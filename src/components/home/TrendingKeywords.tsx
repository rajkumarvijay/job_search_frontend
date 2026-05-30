'use client'

import { useRouter } from 'next/navigation'
import { useTrendingKeywords } from '@/hooks/useTrending'
import { POPULAR_KEYWORDS } from '@/lib/constants'

export function TrendingKeywords() {
  const { data } = useTrendingKeywords()
  const router = useRouter()
  const items = data?.map(k => k.keyword) ?? POPULAR_KEYWORDS
  const doubled = [...items, ...items]

  return (
    <section style={{ padding: '80px 0', background: 'rgba(15,32,68,0.3)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', marginBottom: 32 }}>
        <div className="sec-label">What's in demand</div>
        <h2 className="sec-title">Trending Keywords</h2>
        <p className="sec-sub" style={{ marginBottom: 0 }}>The skills driving India's 2025 hiring market</p>
      </div>

      <div style={{ overflow: 'hidden', paddingBottom: 4 }}>
        <div style={{
          display: 'flex',
          gap: 12,
          animation: 'marquee 35s linear infinite',
          width: 'max-content',
        }}>
          {doubled.map((kw, i) => (
            <button
              key={`${kw}-${i}`}
              onClick={() => router.push(`/search?q=${encodeURIComponent(kw)}&location=India`)}
              style={{
                flexShrink: 0,
                padding: '10px 20px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid #1E3A5F',
                background: '#0F2044',
                color: '#8B9DC3',
                cursor: 'pointer',
                transition: 'all 0.18s',
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
                el.style.background = '#0F2044'
              }}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
