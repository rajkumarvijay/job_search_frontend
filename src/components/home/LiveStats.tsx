'use client'

import { useEffect, useRef, useState } from 'react'
import { usePortalStats } from '@/hooks/useTrending'

const FALLBACK = { total_active_jobs: 485000, top_salary_lpa: '55 LPA', platform_count: 6, cities_covered: 45 }

/** Height of each digit tile in px — must be a fixed value for transform math */
const DH = 52

/* ── Single character slot ────────────────────────────────────────────── */
function SlotChar({
  ch,
  index,
  active,
  color,
}: {
  ch: string
  index: number
  active: boolean
  color: string
}) {
  const isDigit = /\d/.test(ch)

  if (!isDigit) {
    // non-digit chars render statically at the same height
    return (
      <span
        style={{
          display: 'inline-block',
          height: DH,
          lineHeight: `${DH}px`,
          fontSize: DH,
          fontWeight: 900,
          color,
          letterSpacing: '-0.02em',
          verticalAlign: 'top',
        }}
      >
        {ch}
      </span>
    )
  }

  const targetIdx = parseInt(ch, 10)

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        height: DH,
        verticalAlign: 'top',
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          /* slide from 0 → target when active */
          transform: active ? `translateY(-${targetIdx * DH}px)` : 'translateY(0px)',
          transition: active ? 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          transitionDelay: active ? `${index * 75}ms` : '0ms',
          willChange: 'transform',
        }}
      >
        {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
          <span
            key={d}
            style={{
              display: 'block',
              height: DH,
              lineHeight: `${DH}px`,
              fontSize: DH,
              fontWeight: 900,
              color,
              letterSpacing: '-0.02em',
            }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  )
}

/* ── Full number rendered as individual animated slots ───────────────── */
function SlotNumber({ display, color, active }: { display: string; color: string; active: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-start', lineHeight: 1 }}>
      {display.split('').map((ch, i) => (
        <SlotChar key={i} ch={ch} index={i} active={active} color={color} />
      ))}
    </span>
  )
}

/* ── Stats definition ─────────────────────────────────────────────────── */
const STATS = (s: typeof FALLBACK) => [
  { display: Math.round(s.total_active_jobs / 1000) + 'K+', label: 'Active Jobs', color: '#00C9B1' },
  { display: s.top_salary_lpa,                              label: 'Top Salary',  color: '#38BDF8' },
  { display: String(s.platform_count),                      label: 'Portals',     color: '#A78BFA' },
  { display: s.cities_covered + '+',                        label: 'Cities',      color: '#FBBF24' },
]

/* ── Section ──────────────────────────────────────────────────────────── */
export function LiveStats() {
  const { data } = usePortalStats()
  const s = data ?? FALLBACK
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section style={{ padding: '56px 24px', background: '#0A1628' }}>
      <div
        ref={ref}
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 72,
          flexWrap: 'wrap',
        }}
      >
        {STATS(s).map(({ display, label, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            {/* slot-machine number */}
            <SlotNumber display={display} color={color} active={active} />

            {/* label below */}
            <div
              style={{
                fontSize: 12,
                color: '#8B9DC3',
                marginTop: 10,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
