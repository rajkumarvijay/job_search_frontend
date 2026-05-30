'use client'

import { useState, useRef } from 'react'
import { Paperclip, X, Upload, CheckCircle, AlertTriangle, Loader2, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import { api } from '@/lib/api'

interface ATSResult {
  ats_score:              number
  grade:                  string
  summary:                string
  strengths:              string[]
  improvements:           { category: string; issue: string; fix: string; impact: string }[]
  missing_keywords:       string[]
  recommended_keywords:   string[]
  format_issues:          string[]
  quick_wins:             string[]
  error?:                 string
}

const SCORE_COLOR = (s: number) =>
  s >= 80 ? '#4ADE80' : s >= 60 ? '#FBBF24' : s >= 40 ? '#FB923C' : '#F87171'

const IMPACT_COLOR: Record<string, string> = {
  High: '#F87171', Medium: '#FBBF24', Low: '#4ADE80',
}

export function ResumeUpload() {
  const [open,      setOpen]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<ATSResult | null>(null)
  const [fileName,  setFileName]  = useState('')
  const [expanded,  setExpanded]  = useState<string | null>('improvements')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setFileName(file.name)
    setLoading(true)
    setResult(null)
    setOpen(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('target_role', '')
      const { data } = await api.post('/ai/resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 90000,
      })
      setResult(data)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Analysis failed'
      setResult({ ats_score: 0, grade: 'F', summary: msg, strengths: [], improvements: [], missing_keywords: [], recommended_keywords: [], format_issues: [], quick_wins: [], error: msg })
    } finally {
      setLoading(false)
    }
  }

  const toggle = (key: string) => setExpanded(prev => prev === key ? null : key)

  return (
    <>
      {/* Upload button (inline in search bar) */}
      <button
        type="button"
        title="Upload resume for ATS score"
        onClick={() => fileRef.current?.click()}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 16px', height: 48, borderRadius: 10,
          background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)',
          color: '#00C9B1', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          transition: 'all 0.18s', flexShrink: 0, whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = 'rgba(0,201,177,0.15)'
          el.style.borderColor = '#00C9B1'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = 'rgba(0,201,177,0.08)'
          el.style.borderColor = 'rgba(0,201,177,0.25)'
        }}
      >
        <Paperclip size={15} />
        <span className="hidden sm:inline">Resume Score</span>
      </button>

      <input
        ref={fileRef} type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
      />

      {/* Modal overlay */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div style={{
            background: '#0F2044', border: '1px solid #1E3A5F',
            borderRadius: 20, width: '100%', maxWidth: 640,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid #1E3A5F', position: 'sticky', top: 0, background: '#0F2044', zIndex: 1, borderRadius: '20px 20px 0 0',
            }}>
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

            <div style={{ padding: '24px' }}>
              {/* Loading */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Loader2 size={40} color="#00C9B1" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ color: '#F0F4FF', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Analysing your resume…</p>
                  <p style={{ color: '#8B9DC3', fontSize: 13 }}>Gemini AI is checking ATS compatibility, keywords, and formatting</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {/* Results */}
              {!loading && result && !result.error && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Score circle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 16, border: '1px solid #1E3A5F' }}>
                    <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                      <svg width="90" height="90" viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="38" fill="none" stroke="#1E3A5F" strokeWidth="7"/>
                        <circle cx="45" cy="45" r="38" fill="none"
                          stroke={SCORE_COLOR(result.ats_score)}
                          strokeWidth="7" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 38}`}
                          strokeDashoffset={`${2 * Math.PI * 38 * (1 - result.ats_score / 100)}`}
                          transform="rotate(-90 45 45)"
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: SCORE_COLOR(result.ats_score), lineHeight: 1 }}>{result.ats_score}</span>
                        <span style={{ fontSize: 10, color: '#8B9DC3' }}>/ 100</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 28, fontWeight: 900, color: SCORE_COLOR(result.ats_score) }}>Grade {result.grade}</span>
                        {result.ats_score >= 70 ? <CheckCircle size={20} color="#4ADE80" /> : <AlertTriangle size={20} color="#FBBF24" />}
                      </div>
                      <p style={{ fontSize: 13, color: '#8B9DC3', lineHeight: 1.6, margin: 0 }}>{result.summary}</p>
                    </div>
                  </div>

                  {/* Quick wins */}
                  {result.quick_wins?.length > 0 && (
                    <Section label="⚡ Quick Wins" color="#FBBF24">
                      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {result.quick_wins.map((w, i) => <li key={i} style={{ fontSize: 13, color: '#F0F4FF', lineHeight: 1.6 }}>{w}</li>)}
                      </ul>
                    </Section>
                  )}

                  {/* Improvements accordion */}
                  {result.improvements?.length > 0 && (
                    <Accordion label={`🔧 Improvements (${result.improvements.length})`} id="improvements" expanded={expanded} onToggle={toggle}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {result.improvements.map((imp, i) => (
                          <div key={i} style={{ padding: 14, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid #1E3A5F' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#F0F4FF' }}>{imp.category}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${IMPACT_COLOR[imp.impact]}20`, color: IMPACT_COLOR[imp.impact] }}>{imp.impact} Impact</span>
                            </div>
                            <p style={{ fontSize: 12, color: '#F87171', margin: '0 0 4px' }}>{imp.issue}</p>
                            <p style={{ fontSize: 12, color: '#4ADE80', margin: 0 }}>✓ {imp.fix}</p>
                          </div>
                        ))}
                      </div>
                    </Accordion>
                  )}

                  {/* Keywords */}
                  {result.recommended_keywords?.length > 0 && (
                    <Accordion label="🏷 Recommended Keywords" id="keywords" expanded={expanded} onToggle={toggle}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {result.recommended_keywords.map(kw => (
                          <span key={kw} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(0,201,177,0.1)', border: '1px solid rgba(0,201,177,0.25)', color: '#00C9B1', fontSize: 12, fontWeight: 600 }}>{kw}</span>
                        ))}
                      </div>
                    </Accordion>
                  )}

                  {/* Strengths */}
                  {result.strengths?.length > 0 && (
                    <Accordion label="✅ Strengths" id="strengths" expanded={expanded} onToggle={toggle}>
                      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {result.strengths.map((s, i) => <li key={i} style={{ fontSize: 13, color: '#4ADE80', lineHeight: 1.6 }}>{s}</li>)}
                      </ul>
                    </Accordion>
                  )}

                  {/* Upload another */}
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 12, border: '1px dashed #1E3A5F', background: 'transparent', color: '#8B9DC3', cursor: 'pointer', fontSize: 13, transition: 'all 0.18s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00C9B1'; (e.currentTarget as HTMLButtonElement).style.color = '#00C9B1' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E3A5F'; (e.currentTarget as HTMLButtonElement).style.color = '#8B9DC3' }}
                  >
                    <Upload size={14} /> Upload a different resume
                  </button>
                </div>
              )}

              {/* Error */}
              {!loading && result?.error && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <AlertTriangle size={32} color="#F87171" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#F87171', fontWeight: 700, marginBottom: 6 }}>Analysis failed</p>
                  <p style={{ color: '#8B9DC3', fontSize: 13 }}>{result.error}</p>
                  <p style={{ color: '#8B9DC3', fontSize: 12, marginTop: 8 }}>Make sure GEMINI_API_KEY is set in Railway.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Section({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(0,0,0,0.15)', border: '1px solid #1E3A5F' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  )
}

function Accordion({ label, id, expanded, onToggle, children }: { label: string; id: string; expanded: string | null; onToggle: (id: string) => void; children: React.ReactNode }) {
  const isOpen = expanded === id
  return (
    <div style={{ borderRadius: 12, border: `1px solid ${isOpen ? 'rgba(0,201,177,0.3)' : '#1E3A5F'}`, background: isOpen ? 'rgba(0,201,177,0.03)' : 'transparent', overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button onClick={() => onToggle(id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#F0F4FF' }}>{label}</span>
        {isOpen ? <ChevronUp size={15} color="#8B9DC3" /> : <ChevronDown size={15} color="#8B9DC3" />}
      </button>
      {isOpen && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  )
}
