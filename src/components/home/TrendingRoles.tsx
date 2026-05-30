'use client'

import { useRouter } from 'next/navigation'
import { Code, BarChart2, Layers, Server, Monitor, Database, Cpu, Cloud, PenTool, TrendingUp, CheckCircle, Smartphone, ArrowRight } from 'lucide-react'
import { useTrendingRoles } from '@/hooks/useTrending'
import type { TrendingRole } from '@/types'

const ICONS: Record<string, React.ElementType> = {
  code: Code, 'bar-chart': BarChart2, layers: Layers, server: Server,
  monitor: Monitor, database: Database, cpu: Cpu, cloud: Cloud,
  'pen-tool': PenTool, 'trending-up': TrendingUp, 'check-circle': CheckCircle, smartphone: Smartphone,
}

const ACCENT_COLORS = [
  '#00C9B1', '#38BDF8', '#A78BFA', '#FBBF24',
  '#34D399', '#F472B6', '#60A5FA', '#FB923C',
  '#4ADE80', '#C084FC', '#FCD34D', '#67E8F9',
]

function RoleCard({ role, idx }: { role: TrendingRole; idx: number }) {
  const router = useRouter()
  const Icon = ICONS[role.icon] ?? Code
  const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length]

  return (
    <button
      onClick={() => router.push(`/search?q=${encodeURIComponent(role.role)}&location=India`)}
      style={{
        flexShrink: 0,
        width: 220,
        padding: 20,
        background: '#0F2044',
        border: '1px solid #1E3A5F',
        borderRadius: 16,
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = `${accent}55`
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = `0 8px 32px ${accent}18`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = '#1E3A5F'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent, opacity: 0.6 }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${accent}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={accent} />
        </div>
        <ArrowRight size={14} color="#8B9DC3" />
      </div>

      <div style={{ fontWeight: 700, fontSize: 14, color: '#F0F4FF', marginBottom: 4, lineHeight: 1.3 }}>
        {role.role}
      </div>
      <div style={{ fontSize: 12, color: '#8B9DC3', marginBottom: 12 }}>
        {role.count.toLocaleString('en-IN')} open jobs
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          padding: '3px 9px', borderRadius: 6,
          background: `${accent}15`,
          color: accent, fontSize: 11, fontWeight: 600,
          border: `1px solid ${accent}30`,
        }}>
          {role.top_skill}
        </span>
        {role.avg_salary_lpa && (
          <span style={{ fontSize: 11, color: '#8B9DC3' }}>
            ₹{role.avg_salary_lpa} LPA
          </span>
        )}
      </div>
    </button>
  )
}

export function TrendingRoles() {
  const { data: roles, isLoading } = useTrendingRoles()

  return (
    <section style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="sec-label">Hot right now</div>
        <h2 className="sec-title">Trending Roles in India</h2>
        <p className="sec-sub">Click any role to instantly search live jobs across all portals</p>
      </div>

      <div style={{ padding: '4px 24px 20px', overflowX: 'auto' }} className="no-scroll">
        <div style={{ display: 'flex', gap: 14, width: 'max-content', paddingLeft: 'max(0px, calc((100vw - 1280px) / 2))', paddingRight: 24 }}>
          {isLoading
            ? Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{
                  flexShrink: 0, width: 220, height: 140,
                  background: '#0F2044', borderRadius: 16, border: '1px solid #1E3A5F',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
              ))
            : (roles ?? []).map((role, i) => <RoleCard key={role.role} role={role} idx={i} />)
          }
        </div>
      </div>
    </section>
  )
}
