'use client'

import { TrendingUp, IndianRupee, Building2, MapPin } from 'lucide-react'
import { usePortalStats } from '@/hooks/useTrending'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const FALLBACK = { total_active_jobs: 485000, top_salary_lpa: '55 LPA', platform_count: 6, cities_covered: 45 }

const STATS = (s: typeof FALLBACK) => [
  {
    icon: TrendingUp,
    color: '#00C9B1',
    bg: 'rgba(0,201,177,0.08)',
    value: <AnimatedCounter target={s.total_active_jobs} suffix="+" />,
    label: 'Active Jobs in India',
  },
  {
    icon: IndianRupee,
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.08)',
    value: <span>{s.top_salary_lpa}</span>,
    label: 'Top Salary Package',
  },
  {
    icon: Building2,
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.08)',
    value: <AnimatedCounter target={s.platform_count} duration={600} separator={false} />,
    label: 'Portals Aggregated',
  },
  {
    icon: MapPin,
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.08)',
    value: <AnimatedCounter target={s.cities_covered} duration={1000} suffix="+" separator={false} />,
    label: 'Cities Covered',
  },
]

export function LiveStats() {
  const { data } = usePortalStats()
  const s = data ?? FALLBACK

  return (
    <section style={{
      padding: '0 24px',
      borderTop: '1px solid #1E3A5F',
      borderBottom: '1px solid #1E3A5F',
      background: 'rgba(15,32,68,0.4)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 0,
      }}>
        {STATS(s).map(({ icon: Icon, color, bg, value, label }, i) => (
          <div key={label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '28px 24px',
            borderRight: i < 3 ? '1px solid #1E3A5F' : 'none',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 13, color: '#8B9DC3', marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
