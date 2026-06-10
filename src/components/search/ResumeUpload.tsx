'use client'

import { useState, useRef } from 'react'
import {
  Paperclip, X, CheckCircle, AlertTriangle, Loader2,
  ChevronDown, ChevronUp, Zap, ArrowRight, Star,
  Briefcase, MapPin, ExternalLink,
} from 'lucide-react'
import { resumeApi } from '@/lib/api'
import type { ResumeResult, RecommendedJob } from '@/types'

// --- helpers ------------------------------------------------------------------
const scoreColor = (s: number) =>
  s >= 80 ? '#4ADE80' : s >= 65 ? '#00C9B1' : s >= 45 ? '#FBBF24' : s >= 30 ? '#FB923C' : '#F87171'

const impactColor: Record<string, string> = {
  High: '#F87171', Medium: '#FBBF24', Low: '#4ADE80',
}

// --- sub-components -----------------------------------------------------------
function Tag({ text, color = '#00C9B1' }: { text: string; color?: string }) {
  return (
    <span style={{ padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${color}18`, border: `1px solid ${color}35`, color }}>
      {text}
    </span>
  )
}

function Accordion({
  label, id, expanded, onToggle, children, badge,
}: {
  label: string; id: string; expanded: string | null
  onToggle: (id: string) => void; children: React.ReactNode; badge?: number
}) {
  const open = expanded === id
  return (
    <div style={{ borderRadius: 12, border: `1px solid ${open ? 'rgba(0,201,177,0.3)' : '#1E3A5F'}`, overflow: 'hidden', background: open ? 'rgba(0,201,177,0.02)' : 'transparent' }}>
      <button onClick={() => onToggle(id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F0F4FF' }}>{label}</span>
          {badge !== undefined && badge > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20, background: 'rgba(0,201,177,0.15)', color: '#00C9B1' }}>{badge}</span>
          )}
        </div>
        {open ? <ChevronUp size={14} color="#8B9DC3" /> : <ChevronDown size={14} color="#8B9DC3" />}
      </button>
      {open && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  )
}

function MiniJobCard({ job }: { job: RecommendedJob }) {
  const [h, setH] = useState(false)
  return (
    <a
      href={job.job_url || '#'} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'block', textDecoration: 'none', padding: 12, borderRadius: 10, border: `1px solid ${h ? 'rgba(0,201,177,0.3)' : '#1E3A5F'}`, background: h ? 'rgba(0,201,177,0.03)' : 'transparent', transition: 'border-color 0.18s' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: h ? '#00C9B1' : '#F0F4FF', marginBottom: 2, transition: 'color 0.18s' }}>{job.title}</div>
          <div style={{ fontSize: 11, color: '#8B9DC3', display: 'flex', alignItems: 'center', gap: 3 }}><Briefcase size={10} />{job.company}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 6, background: `${scoreColor(job.match_score)}15`, border: `1px solid ${scoreColor(job.match_score)}35`, flexShrink: 0 }}>
          <Star size={9} color={scoreColor(job.match_score)} fill={scoreColor(job.match_score)} />
          <span style={{ fontSize: 11, fontWeight: 800, color: scoreColor(job.match_score) }}>{job.match_score}%</span>
        </div>
      </div>
      {job.location && (
        <div style={{ fontSize: 11, color: '#8B9DC3', display: 'flex', alignItems: 'center', gap: 3, marginTop: 6 }}>
          <MapPin size={9} />{job.location}
          {job.is_remote && <span style={{ color: '#A78BFA', marginLeft: 4 }}>· Remote</span>}
          {job.job_url && <ExternalLink size={9} color="#00C9B1" style={{ marginLeft: 'auto' }} />}
        </div>
      )}
    </a>
  )
}

// --- main component -----------------------------------------------------------
export function ResumeUpload() {
  const [open,      setOpen]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<ResumeResult | null>(null)
  const [fileName,  setFileName]  = useState('')
  const [expanded,  setExpanded]  = useState<string | null>('quick_wins')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setFileName(file.name)
    setLoading(true)
    setResult(null)
    setOpen(true)
    try {
      const { data } = await resumeApi.full(file, '', 4)
      setResult(data)
    } catch (e: unknown) {
      let msg = 'Analysis failed. Please try again.'
      if (e && typeof e === 'object') {
        const ae = e as { response?: { data?: { detail?: string } }; message?: string }
        msg = ae.response?.data?.detail || ae.message || msg
      }
      setResult({
        ats_score: 0, grade: 'F', experience_level: '', years_experience: null,
        summary: msg, section_scores: {} as never, top_skills: [],
        recommended_roles: [], strengths: [], improvements: [],
        missing_keywords: [], recommended_keywords: [],
        format_issues: [], quick_wins: [], recommended_jobs: [], error: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  const toggle = (id: string) => setExpanded(p => p === id ? null : id)

  return (
    <>
      {/* trigger button */}
      <button
        type="button"
        title="Upload resume for ATS score"
        onClick={() => fileRef.current?.click()}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', height: 48, borderRadius: 10, background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)', color: '#00C9B1', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.18s', flexShrink: 0, whiteSpace: 'nowrap' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(0,201,177,0.15)'; el.style.borderColor = '#00C9B1' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(0,201,177,0.08)'; el.style.borderColor = 'rgba(0,201,177,0.25)' }}
      >
        <Paperclip size={15} />
        <span className="hidden sm:inline">Resume Score</span>
      </button>

      <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
      />

      {/* modal */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 20, width: '100%', maxWidth: 660, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #1E3A5F', position: 'sticky', top: 0, background: '#0F2044', zIndex: 1, borderRadius: '20px 20px 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,201,177,0.1)', border: '1px solid rgba(0,201,177,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={17} color="#00C9B1" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#F0F4FF' }}>AI Resume Analyser</div>
                  {fileName && <div style={{ fontSize: 12, color: '#8B9DC3' }}>{fileName}</div>}
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B9DC3', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* loading */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Loader2 size={40} color="#00C9B1" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ color: '#F0F4FF', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Analysing your resume…</p>
                  <p style={{ color: '#8B9DC3', fontSize: 13 }}>Gemini AI is scoring your resume and finding job matches</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {/* error */}
              {!loading && result?.error && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <AlertTriangle size={32} color="#F87171" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#F87171', fontWeight: 700, marginBottom: 6 }}>Analysis failed</p>
                  <p style={{ color: '#8B9DC3', fontSize: 13 }}>{result.error}</p>
                </div>
              )}

              {/* results */}
              {!loading && result && !result.error && (
                <>
                  {/* score hero */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 16, border: '1px solid #1E3A5F' }}>
                    <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                      <svg width="90" height="90" viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="38" fill="none" stroke="#1E3A5F" strokeWidth="7" />
                        <circle cx="45" cy="45" r="38" fill="none"
                          stroke={scoreColor(result.ats_score)} strokeWidth="7" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 38}`}
                          strokeDashoffset={`${2 * Math.PI * 38 * (1 - result.ats_score / 100)}`}
                          transform="rotate(-90 45 45)"
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: scoreColor(result.ats_score), lineHeight: 1 }}>{result.ats_score}</span>
                        <span style={{ fontSize: 10, color: '#8B9DC3' }}>/ 100</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 26, fontWeight: 900, color: scoreColor(result.ats_score) }}>Grade {result.grade}</span>
                        {result.ats_score >= 70
                          ? <CheckCircle size={18} color="#4ADE80" />
                          : <AlertTriangle size={18} color="#FBBF24" />
                        }
                        {result.experience_level && (
                          <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 6, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#A78BFA' }}>
                            {result.experience_level}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: '#8B9DC3', lineHeight: 1.6, margin: 0 }}>{result.summary}</p>
                      {result.recommended_roles?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                          <span style={{ fontSize: 11, color: '#8B9DC3', alignSelf: 'center' }}>Best for:</span>
                          {result.recommended_roles.slice(0, 3).map(r => <Tag key={r} text={r} />)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* quick wins */}
                  {result.quick_wins?.length > 0 && (
                    <Accordion label="⚡ Quick Wins" id="quick_wins" expanded={expanded} onToggle={toggle} badge={result.quick_wins.length}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {result.quick_wins.map((w, i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 12px', borderRadius: 8, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.18)' }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: '#FBBF24', flexShrink: 0 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: '#F0F4FF', lineHeight: 1.5 }}>{w}</span>
                          </div>
                        ))}
                      </div>
                    </Accordion>
                  )}

                  {/* improvements */}
                  {result.improvements?.length > 0 && (
                    <Accordion label="🔧 Improvements" id="improvements" expanded={expanded} onToggle={toggle} badge={result.improvements.length}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {result.improvements.map((imp, i) => (
                          <div key={i} style={{ padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid #1E3A5F' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#F0F4FF' }}>{imp.category}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${impactColor[imp.impact] || '#8B9DC3'}20`, color: impactColor[imp.impact] || '#8B9DC3' }}>{imp.impact} Impact</span>
                            </div>
                            <p style={{ fontSize: 12, color: '#F87171', margin: '0 0 4px' }}>❌ {imp.issue}</p>
                            <p style={{ fontSize: 12, color: '#4ADE80', margin: 0 }}>✓ {imp.fix}</p>
                          </div>
                        ))}
                      </div>
                    </Accordion>
                  )}

                  {/* keywords */}
                  {(result.recommended_keywords?.length > 0 || result.top_skills?.length > 0) && (
                    <Accordion label="🏷 Keywords & Skills" id="keywords" expanded={expanded} onToggle={toggle}>
                      {result.top_skills?.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Detected Skills</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {result.top_skills.map(sk => <Tag key={sk} text={sk} color="#FBBF24" />)}
                          </div>
                        </div>
                      )}
                      {result.recommended_keywords?.length > 0 && (
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Add These Keywords</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {result.recommended_keywords.map(kw => <Tag key={kw} text={kw} color="#A78BFA" />)}
                          </div>
                        </div>
                      )}
                    </Accordion>
                  )}

                  {/* strengths */}
                  {result.strengths?.length > 0 && (
                    <Accordion label="✅ Strengths" id="strengths" expanded={expanded} onToggle={toggle} badge={result.strengths.length}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {result.strengths.map((s, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#4ADE80', lineHeight: 1.5 }}>
                            <CheckCircle size={13} style={{ flexShrink: 0, marginTop: 2 }} />{s}
                          </div>
                        ))}
                      </div>
                    </Accordion>
                  )}

                  {/* job recommendations */}
                  {result.recommended_jobs && result.recommended_jobs.length > 0 && (
                    <Accordion label="💼 Matched Jobs" id="jobs" expanded={expanded} onToggle={toggle} badge={result.recommended_jobs.length}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {result.recommended_jobs.map((job: RecommendedJob) => (
                          <MiniJobCard key={job.job_id} job={job} />
                        ))}
                      </div>
                    </Accordion>
                  )}

                  {/* CTA footer */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => fileRef.current?.click()}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 10, border: '1px dashed #1E3A5F', background: 'transparent', color: '#8B9DC3', cursor: 'pointer', fontSize: 13, transition: 'all 0.18s' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = '#00C9B1'; el.style.color = '#00C9B1' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = '#1E3A5F'; el.style.color = '#8B9DC3' }}
                    >
                      Upload Another
                    </button>
                    {result.recommended_roles?.length > 0 && (
                      <a
                        href={`/search?q=${encodeURIComponent(result.recommended_roles[0])}&location=India`}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 10, background: '#00C9B1', color: '#0A1628', fontWeight: 700, fontSize: 13, textDecoration: 'none', transition: 'opacity 0.18s' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        onClick={() => setOpen(false)}
                      >
                        Search {result.recommended_roles[0]} Jobs <ArrowRight size={13} />
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
