'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { PLATFORMS, INDIA_CITIES } from '@/lib/constants'
import { SlidersHorizontal, X } from 'lucide-react'

interface Props { onClose?: () => void }

export function FilterSidebar({ onClose }: Props) {
  const router = useRouter()
  const sp = useSearchParams()
  const q = sp.get('q') ?? ''
  const location = sp.get('location') ?? 'India'
  const activePlatforms = sp.get('platforms') ?? ''

  const update = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(sp.toString())
    value ? p.set(key, value) : p.delete(key)
    router.push(`/search?${p}`)
  }, [router, sp])

  const togglePlatform = useCallback((id: string) => {
    const current = activePlatforms ? activePlatforms.split(',') : []
    const next = current.includes(id) ? current.filter(p => p !== id) : [...current, id]
    update('platforms', next.join(','))
  }, [activePlatforms, update])

  const clearAll = () => router.push(`/search?q=${q}&location=India`)

  return (
    <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={15} color="#00C9B1" />
          <span style={{ fontWeight: 700, fontSize: 14, color: '#F0F4FF' }}>Filters</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(activePlatforms || location !== 'India') && (
            <button onClick={clearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#8B9DC3', display: 'flex', alignItems: 'center', gap: 4 }}>
              <X size={11} /> Clear
            </button>
          )}
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B9DC3' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>Location</label>
        <select
          value={location}
          onChange={e => update('location', e.target.value)}
          style={{ width: '100%', background: '#0A1628', border: '1px solid #1E3A5F', color: '#F0F4FF', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', cursor: 'pointer' }}
        >
          {INDIA_CITIES.map(c => <option key={c} value={c} style={{ background: '#0A1628' }}>{c}</option>)}
        </select>
      </div>

      {/* Platforms */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>Job Portals</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PLATFORMS.map(p => {
            const active = activePlatforms ? activePlatforms.split(',').includes(p.id) : false
            return (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10, textAlign: 'left',
                  border: `1px solid ${active ? 'rgba(0,201,177,0.3)' : '#1E3A5F'}`,
                  background: active ? 'rgba(0,201,177,0.06)' : 'transparent',
                  color: active ? '#00C9B1' : '#8B9DC3',
                  cursor: 'pointer', fontSize: 14, fontWeight: 500,
                  transition: 'all 0.18s',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{p.label}</span>
                {active && <span style={{ fontSize: 11, fontWeight: 700, color: '#00C9B1' }}>✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
