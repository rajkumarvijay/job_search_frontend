'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { SKILL_ROADMAPS } from '@/lib/constants'

const ROLES = Object.keys(SKILL_ROADMAPS)

const LEVELS = [
  { key: 'beginner', label: 'Beginner',  color: '#4ADE80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)' },
  { key: 'mid',      label: 'Mid-Level', color: '#38BDF8', bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.2)' },
  { key: 'senior',   label: 'Senior',    color: '#C084FC', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)' },
]

export function SkillRoadmap() {
  const [open, setOpen] = useState<string | null>(ROLES[0])

  return (
    <section style={{ padding: '80px 24px', background: 'rgba(15,32,68,0.3)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="sec-label">Learn what matters</div>
        <h2 className="sec-title">Skill Roadmaps</h2>
        <p className="sec-sub">Know exactly what to learn at every career stage</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ROLES.map(role => {
            const isOpen = open === role
            const roadmap = SKILL_ROADMAPS[role]
            return (
              <div
                key={role}
                style={{
                  borderRadius: 14,
                  border: `1px solid ${isOpen ? 'rgba(0,201,177,0.35)' : '#1E3A5F'}`,
                  background: isOpen ? '#0F2044' : 'rgba(15,32,68,0.4)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : role)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 24px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 16, color: isOpen ? '#00C9B1' : '#F0F4FF' }}>
                    {role}
                  </span>
                  {isOpen
                    ? <ChevronDown size={18} color="#00C9B1" />
                    : <ChevronRight size={18} color="#8B9DC3" />
                  }
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14 }}>
                    {LEVELS.map(lvl => (
                      <div key={lvl.key} style={{
                        padding: 18, borderRadius: 12,
                        background: lvl.bg, border: `1px solid ${lvl.border}`,
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: lvl.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                          {lvl.label}
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(roadmap[lvl.key as keyof typeof roadmap] ?? []).map(skill => (
                            <li key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#F0F4FF' }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: lvl.color, flexShrink: 0 }} />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
