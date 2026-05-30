import { CheckCircle2, Circle, Minus } from 'lucide-react'
import { PLATFORM_COMPARISON } from '@/lib/constants'

const PORTALS = [
  { name: 'LinkedIn',     color: '#0A66C2' },
  { name: 'Indeed',       color: '#003A9B' },
  { name: 'Glassdoor',    color: '#0CAA41' },
  { name: 'Naukri',       color: '#FF6600' },
  { name: 'ZipRecruiter', color: '#7B2D8B' },
  { name: 'Google Jobs',  color: '#EA4335' },
]

function Cell({ v }: { v: string }) {
  if (v === '✓✓') return <CheckCircle2 size={17} color="#00C9B1" style={{ margin: 'auto' }} />
  if (v === '✓')  return <Circle size={16} color="#8B9DC3" style={{ margin: 'auto' }} />
  if (v === '~')  return <Minus size={14} color="#1E3A5F" style={{ margin: 'auto' }} />
  return <span style={{ color: '#F0F4FF', fontSize: 13, fontWeight: 600 }}>{v}</span>
}

export function PlatformComparison() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="sec-label">How they compare</div>
        <h2 className="sec-title">Job Portal Comparison</h2>
        <p className="sec-sub">We aggregate all of them so you get the best of every platform</p>

        <div style={{ borderRadius: 16, border: '1px solid #1E3A5F', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ background: 'rgba(30,58,95,0.4)', borderBottom: '1px solid #1E3A5F' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.08em', width: 160 }}>Feature</th>
                  {PORTALS.map(p => (
                    <th key={p.name} style={{ padding: '14px 12px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: p.color }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLATFORM_COMPARISON.map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: i < PLATFORM_COMPARISON.length - 1 ? '1px solid #1E3A5F' : 'none', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td style={{ padding: '13px 20px', fontSize: 13, color: '#8B9DC3', fontWeight: 500 }}>{row.feature}</td>
                    {[row.linkedin, row.indeed, row.glassdoor, row.naukri, row.ziprecruiter, row.google].map((v, j) => (
                      <td key={j} style={{ padding: '13px 12px', textAlign: 'center' }}><Cell v={v} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p style={{ marginTop: 12, fontSize: 12, color: '#8B9DC3' }}>
          ✓✓ Excellent &nbsp;·&nbsp; ✓ Good &nbsp;·&nbsp; — Limited
        </p>
      </div>
    </section>
  )
}
