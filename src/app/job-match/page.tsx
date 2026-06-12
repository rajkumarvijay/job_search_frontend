'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Upload, FileText, Zap, CheckCircle2, AlertTriangle,
  X, RotateCcw, BookOpen, Target, TrendingUp, XCircle,
  ChevronDown, ChevronUp, Sparkles, Clock, Star,
} from 'lucide-react'
import { jobMatchApi } from '@/lib/api'
import { AuthGate } from '@/components/auth/AuthGate'
import type {
  JobMatchResult, JobMatchSkill, MissingSkill,
  MatchStrength, LearningRecommendation,
} from '@/types'

// ── helpers ──────────────────────────────────────────────────────────────────
const scoreColor = (s: number) =>
  s >= 85 ? '#4ADE80' : s >= 70 ? '#00C9B1' : s >= 55 ? '#FBBF24' : s >= 35 ? '#FB923C' : '#F87171'

const gradeColor: Record<string, string> = {
  Excellent: '#4ADE80', Strong: '#00C9B1', Good: '#FBBF24', Fair: '#FB923C', Weak: '#F87171',
}

const importanceColor = { 'Must-have': '#F87171', 'Nice-to-have': '#FBBF24' }
const priorityColor   = { High: '#F87171', Medium: '#FBBF24', Low: '#4ADE80' }
const gapColor        = { Large: '#F87171', Medium: '#FBBF24', Small: '#4ADE80' }
const profColor       = { Expert: '#4ADE80', Proficient: '#00C9B1', Familiar: '#38BDF8' }

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 6,
      fontSize: 11, fontWeight: 700,
      background: `${color}18`, border: `1px solid ${color}40`, color,
    }}>{label}</span>
  )
}

function SectionHead({ icon: Icon, title, color, badge }: {
  icon: React.ElementType; title: string; color: string; badge?: number
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} color={color} />
      </div>
      <span style={{ fontWeight: 800, fontSize: 15, color: '#F0F4FF' }}>{title}</span>
      {badge !== undefined && badge > 0 && (
        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${color}18`, color }}>{badge}</span>
      )}
    </div>
  )
}

function Accordion({ label, id, expanded, onToggle, children, badge, color = '#1E3A5F' }: {
  label: string; id: string; expanded: string | null; onToggle: (id: string) => void
  children: React.ReactNode; badge?: number; color?: string
}) {
  const open = expanded === id
  return (
    <div style={{ borderRadius: 14, border: `1px solid ${open ? color : '#1E3A5F'}`, overflow: 'hidden', background: open ? `${color}05` : 'transparent', transition: 'border-color 0.2s' }}>
      <button onClick={() => onToggle(id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#F0F4FF' }}>{label}</span>
          {badge !== undefined && badge > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 8px', borderRadius: 20, background: `${color}22`, color }}>{badge}</span>
          )}
        </div>
        {open ? <ChevronUp size={15} color="#8B9DC3" /> : <ChevronDown size={15} color="#8B9DC3" />}
      </button>
      {open && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  )
}

// ── Score Gauge ───────────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const color = scoreColor(score)
  const r = 70
  const circ = 2 * Math.PI * r
  const dash = circ * (score / 100)

  return (
    <div style={{ position: 'relative', width: 176, height: 176 }}>
      <svg width="176" height="176" viewBox="0 0 176 176">
        <circle cx="88" cy="88" r={r} fill="none" stroke="#1E3A5F" strokeWidth="12" />
        <circle cx="88" cy="88" r={r} fill="none"
          stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
          transform="rotate(-90 88 88)"
          style={{ transition: 'stroke-dashoffset 1.4s ease, stroke 0.4s' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 42, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.03em' }}>{score}</span>
        <span style={{ fontSize: 13, color: '#8B9DC3', fontWeight: 600 }}>/ 100</span>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
function JobMatchPageInner() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [resumeMode, setResumeMode] = useState<'file' | 'text'>('file')
  const [jobDesc, setJobDesc]       = useState('')
  const [dragOver, setDragOver]     = useState(false)

  const [stage, setStage]     = useState<'idle' | 'loading' | 'result'>('idle')
  const [result, setResult]   = useState<JobMatchResult | null>(null)
  const [expanded, setExpanded] = useState<string | null>('matched')
  const [loadMsg, setLoadMsg] = useState('Reading your resume…')

  const fileRef   = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const toggle    = (id: string) => setExpanded(p => p === id ? null : id)

  const analyse = useCallback(async () => {
    if (!jobDesc.trim()) return
    if (resumeMode === 'file' && !resumeFile) return
    if (resumeMode === 'text' && !resumeText.trim()) return

    setStage('loading')
    setResult(null)

    const msgs = [
      'Reading your resume…',
      'Parsing the job description…',
      'Matching skills and experience…',
      'Identifying gaps and strengths…',
      'Building learning recommendations…',
      'Calculating your match score…',
    ]
    let i = 0
    setLoadMsg(msgs[0])
    const t = setInterval(() => { i = (i + 1) % msgs.length; setLoadMsg(msgs[i]) }, 2200)

    try {
      const { data } = await jobMatchApi.analyse({
        job_description: jobDesc,
        file:        resumeMode === 'file' ? resumeFile! : null,
        resume_text: resumeMode === 'text' ? resumeText : '',
      })
      clearInterval(t)
      setResult(data)
      setStage('result')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (e: unknown) {
      clearInterval(t)
      let msg = 'Analysis failed. Please try again.'
      if (e && typeof e === 'object') {
        const ae = e as { response?: { data?: { detail?: string } }; message?: string }
        msg = ae.response?.data?.detail || ae.message || msg
      }
      setResult({ match_score: 0, match_grade: '', match_summary: msg, matched_skills: [], missing_skills: [], strengths: [], learning_recommendations: [], role_fit_tags: [], quick_actions: [], error: msg })
      setStage('result')
    }
  }, [resumeFile, resumeText, resumeMode, jobDesc])

  const reset = () => { setStage('idle'); setResult(null); setResumeFile(null); setJobDesc('') }

  // ── LOADING ─────────────────────────────────────────────────────────────────
  if (stage === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ position: 'relative', width: 88, height: 88, margin: '0 auto 28px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #1E3A5F' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#FBBF24', animation: 'spin 1s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={30} color="#FBBF24" />
            </div>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF', marginBottom: 10 }}>Analysing Your Match</h2>
          <p style={{ fontSize: 14, color: '#FBBF24', fontWeight: 600, marginBottom: 8, minHeight: 20 }}>{loadMsg}</p>
          <p style={{ fontSize: 13, color: '#8B9DC3' }}>Powered by Gemini AI · 10–20 seconds</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── ERROR ────────────────────────────────────────────────────────────────────
  if (stage === 'result' && result?.error) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <AlertTriangle size={40} color="#F87171" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F0F4FF', marginBottom: 8 }}>Analysis Failed</h2>
        <p style={{ fontSize: 14, color: '#8B9DC3', maxWidth: 420, marginBottom: 24 }}>{result.error}</p>
        <button onClick={reset} style={{ padding: '12px 28px', borderRadius: 12, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#FBBF24', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
          Try Again
        </button>
      </div>
    )
  }

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (stage === 'result' && result) {
    const col   = scoreColor(result.match_score)
    const gCol  = gradeColor[result.match_grade] ?? col

    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', padding: '48px 24px 80px' }} ref={resultRef}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>

          {/* page header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#F0F4FF', marginBottom: 4 }}>Job Match Analysis</h1>
              <p style={{ fontSize: 13, color: '#8B9DC3' }}>Resume vs Job Description</p>
            </div>
            <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', color: '#FBBF24', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <RotateCcw size={13} /> Analyse Again
            </button>
          </div>

          {/* ── HERO SCORE CARD ── */}
          <div style={{ background: '#0F2044', border: `1px solid ${col}30`, borderRadius: 24, padding: '32px 36px', marginBottom: 24, display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
            <ScoreGauge score={result.match_score} />
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: col }}>{result.match_grade} Match</span>
                <Pill label={result.match_grade} color={gCol} />
                {result.experience_match?.verdict && (
                  <Pill label={result.experience_match.verdict} color="#38BDF8" />
                )}
              </div>
              <p style={{ fontSize: 14, color: '#B0BDD8', lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>
                {result.match_summary}
              </p>
              {result.role_fit_tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {result.role_fit_tags.map(tag => <Pill key={tag} label={tag} color="#A78BFA" />)}
                </div>
              )}
            </div>

            {/* stat boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minWidth: 200 }}>
              {[
                { label: 'Matched', value: result.matched_skills?.length ?? 0, color: '#4ADE80' },
                { label: 'Missing', value: result.missing_skills?.length ?? 0, color: '#F87171' },
                { label: 'Strengths', value: result.strengths?.length ?? 0, color: '#00C9B1' },
                { label: 'To Learn', value: result.learning_recommendations?.length ?? 0, color: '#FBBF24' },
              ].map(({ label, value, color: c }) => (
                <div key={label} style={{ textAlign: 'center', padding: '14px 10px', borderRadius: 12, background: `${c}08`, border: `1px solid ${c}25` }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: c, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 11, color: '#8B9DC3', fontWeight: 600, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── QUICK ACTIONS ── */}
          {result.quick_actions?.length > 0 && (
            <div style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.06),rgba(251,191,36,0.02))', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Zap size={16} color="#FBBF24" fill="#FBBF24" />
                <span style={{ fontWeight: 800, fontSize: 14, color: '#F0F4FF' }}>Quick Actions to Improve Your Match</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
                {result.quick_actions.map((action, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'rgba(10,22,40,0.5)' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#FBBF24', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#D4E0F0', lineHeight: 1.5 }}>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TWO COL LAYOUT ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: 20, alignItems: 'start' }}>

            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Matched Skills */}
              <Accordion label="✅ Matched Skills" id="matched" expanded={expanded} onToggle={toggle} badge={result.matched_skills?.length} color="#4ADE80">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(result.matched_skills as JobMatchSkill[]).map((sk, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.15)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CheckCircle2 size={14} color="#4ADE80" />
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#F0F4FF' }}>{sk.skill}</span>
                        </div>
                        {sk.proficiency && (
                          <Pill label={sk.proficiency} color={profColor[sk.proficiency as keyof typeof profColor] ?? '#8B9DC3'} />
                        )}
                      </div>
                      {sk.found_in_resume && (
                        <p style={{ fontSize: 12, color: '#8B9DC3', margin: '0 0 4px', paddingLeft: 22, fontStyle: 'italic' }}>
                          Resume: &ldquo;{sk.found_in_resume}&rdquo;
                        </p>
                      )}
                      {sk.jd_requirement && (
                        <p style={{ fontSize: 12, color: '#4A6FA5', margin: 0, paddingLeft: 22 }}>
                          JD requires: {sk.jd_requirement}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* Missing Skills */}
              <Accordion label="❌ Missing Skills" id="missing" expanded={expanded} onToggle={toggle} badge={result.missing_skills?.length} color="#F87171">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(result.missing_skills as MissingSkill[]).map((sk, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <XCircle size={14} color="#F87171" />
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#F0F4FF' }}>{sk.skill}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Pill label={sk.importance} color={importanceColor[sk.importance] ?? '#8B9DC3'} />
                          {sk.gap_size && <Pill label={`${sk.gap_size} gap`} color={gapColor[sk.gap_size] ?? '#8B9DC3'} />}
                        </div>
                      </div>
                      {sk.jd_context && (
                        <p style={{ fontSize: 12, color: '#8B9DC3', margin: 0, paddingLeft: 22, lineHeight: 1.5 }}>
                          {sk.jd_context}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* Strengths */}
              <Accordion label="💪 Strengths" id="strengths" expanded={expanded} onToggle={toggle} badge={result.strengths?.length} color="#00C9B1">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(result.strengths as MatchStrength[]).map((s, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(0,201,177,0.04)', border: '1px solid rgba(0,201,177,0.15)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Star size={14} color="#00C9B1" fill="#00C9B1" />
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#F0F4FF' }}>{s.title}</span>
                        </div>
                        {s.impact && <Pill label={s.impact} color={s.impact === 'High' ? '#00C9B1' : '#38BDF8'} />}
                      </div>
                      <p style={{ fontSize: 13, color: '#A8C0E0', margin: 0, paddingLeft: 22, lineHeight: 1.6 }}>{s.detail}</p>
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* Learning Recommendations */}
              <Accordion label="📚 Learning Recommendations" id="learning" expanded={expanded} onToggle={toggle} badge={result.learning_recommendations?.length} color="#FBBF24">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(result.learning_recommendations as LearningRecommendation[]).map((rec, i) => (
                    <div key={i} style={{ padding: '16px 18px', borderRadius: 12, background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <BookOpen size={14} color="#FBBF24" />
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#F0F4FF' }}>{rec.skill}</span>
                        </div>
                        <Pill label={rec.priority} color={priorityColor[rec.priority] ?? '#8B9DC3'} />
                      </div>
                      <p style={{ fontSize: 13, color: '#A8C0E0', margin: '0 0 10px', paddingLeft: 22, lineHeight: 1.55 }}>
                        {rec.reason}
                      </p>
                      <div style={{ display: 'flex', gap: 10, paddingLeft: 22, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                          <TrendingUp size={11} color="#FBBF24" />
                          <span style={{ fontSize: 12, color: '#FBBF24', fontWeight: 600 }}>{rec.resource}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Clock size={11} color="#8B9DC3" />
                          <span style={{ fontSize: 12, color: '#8B9DC3' }}>{rec.timeframe}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Accordion>

            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 }}>

              {/* Score breakdown */}
              <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 16, padding: 20 }}>
                <SectionHead icon={Target} title="Score Breakdown" color={col} />
                {[
                  { label: 'Matched Skills', value: result.matched_skills?.length ?? 0, total: (result.matched_skills?.length ?? 0) + (result.missing_skills?.length ?? 0), color: '#4ADE80' },
                  { label: 'Missing Skills', value: result.missing_skills?.filter(s => s.importance === 'Must-have').length ?? 0, total: result.missing_skills?.length ?? 0, color: '#F87171', invert: true },
                  { label: 'Strengths', value: result.strengths?.filter(s => s.impact === 'High').length ?? 0, total: result.strengths?.length ?? 0, color: '#00C9B1' },
                ].map(({ label, value, total, color: c, invert }) => {
                  const pct = total ? Math.round((value / total) * 100) : 0
                  const barPct = invert ? (total ? Math.round(((total - value) / total) * 100) : 0) : pct
                  return (
                    <div key={label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: '#B0BDD8' }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{value} / {total}</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: '#1E3A5F', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${barPct}%`, borderRadius: 3, background: c, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Experience match */}
              {result.experience_match && (
                <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 16, padding: 20 }}>
                  <SectionHead icon={Sparkles} title="Experience Match" color="#38BDF8" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    {[
                      { label: 'Required', value: result.experience_match.required_years != null ? `${result.experience_match.required_years} yrs` : 'N/A' },
                      { label: 'You Have', value: result.experience_match.candidate_years != null ? `${result.experience_match.candidate_years} yrs` : 'N/A' },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ textAlign: 'center', padding: '12px', borderRadius: 10, background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)' }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#38BDF8' }}>{value}</div>
                        <div style={{ fontSize: 11, color: '#8B9DC3', marginTop: 2 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  {result.experience_match.verdict && (
                    <div style={{ textAlign: 'center', padding: '8px', borderRadius: 8, background: 'rgba(56,189,248,0.08)' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#38BDF8' }}>{result.experience_match.verdict}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Must-have gap alert */}
              {result.missing_skills?.some(s => s.importance === 'Must-have') && (
                <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <AlertTriangle size={15} color="#F87171" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#F87171' }}>Must-Have Gaps</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {result.missing_skills.filter(s => s.importance === 'Must-have').map(s => (
                      <Pill key={s.skill} label={s.skill} color="#F87171" />
                    ))}
                  </div>
                </div>
              )}

              {/* Generate cover letter CTA */}
              <div style={{ background: 'linear-gradient(135deg,rgba(167,139,250,0.08),rgba(0,201,177,0.05))', border: '1px solid rgba(167,139,250,0.22)', borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
                <FileText size={22} color="#A78BFA" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F4FF', marginBottom: 6 }}>Write a Cover Letter</p>
                <p style={{ fontSize: 12, color: '#8B9DC3', marginBottom: 14, lineHeight: 1.5 }}>
                  Tailored to this exact job description in one click.
                </p>
                <a href="/cover-letter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 10, background: '#A78BFA', color: '#0A1628', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  Generate Cover Letter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── FORM ─────────────────────────────────────────────────────────────────────
  const canAnalyse = jobDesc.trim().length > 50 && (
    (resumeMode === 'file' && !!resumeFile) ||
    (resumeMode === 'text' && resumeText.trim().length > 100)
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', padding: '56px 24px 80px' }}>
      <div style={{ maxWidth: 940, margin: '0 auto' }}>

        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, marginBottom: 20, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', color: '#FBBF24', fontSize: 13, fontWeight: 600 }}>
            <Target size={13} /> AI Job Match Scorer
          </div>
          <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 900, letterSpacing: '-0.035em', color: '#F0F4FF', lineHeight: 1.1, marginBottom: 16 }}>
            How Well Does Your Resume{' '}
            <span style={{ background: 'linear-gradient(90deg,#FBBF24,#F87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Match the Job?
            </span>
          </h1>
          <p style={{ fontSize: 17, color: '#8B9DC3', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            Upload your resume and paste the job description. Get an instant match score with matched skills, gaps, strengths, and exactly what to learn next.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 24 }}>
            {['📊 Match Score 0–100', '✅ Matched Skills', '❌ Missing Skills', '💪 Strengths', '📚 Learning Path', '⚡ Quick Fixes'].map(p => (
              <span key={p} style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)', color: '#A8C0E0' }}>{p}</span>
            ))}
          </div>
        </div>

        {/* FORM CARD */}
        <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 24, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* resume input */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Your Resume <span style={{ color: '#F87171' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['file', 'text'] as const).map(m => (
                  <button key={m} onClick={() => setResumeMode(m)} style={{ padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: resumeMode === m ? 'rgba(251,191,36,0.15)' : 'transparent', color: resumeMode === m ? '#FBBF24' : '#4A6FA5' }}>
                    {m === 'file' ? 'Upload File' : 'Paste Text'}
                  </button>
                ))}
              </div>
            </div>

            {resumeMode === 'file' ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setResumeFile(f) }}
                onClick={() => fileRef.current?.click()}
                style={{ border: `2px dashed ${dragOver ? '#FBBF24' : resumeFile ? 'rgba(251,191,36,0.5)' : '#1E3A5F'}`, borderRadius: 14, padding: '28px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(251,191,36,0.03)' : 'rgba(10,22,40,0.5)', transition: 'all 0.2s' }}
              >
                {resumeFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <FileText size={20} color="#FBBF24" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#FBBF24' }}>{resumeFile.name}</span>
                    <button onClick={e => { e.stopPropagation(); setResumeFile(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F87171', padding: 0 }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={24} color="#4A6FA5" style={{ margin: '0 auto 10px' }} />
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F4FF', margin: '0 0 4px' }}>{dragOver ? 'Drop it here!' : 'Drag & drop or click to upload'}</p>
                    <p style={{ fontSize: 12, color: '#8B9DC3', margin: 0 }}>PDF · DOCX · TXT · Max 5 MB</p>
                  </>
                )}
              </div>
            ) : (
              <textarea
                value={resumeText} onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your resume text here…"
                rows={7}
                style={{ width: '100%', boxSizing: 'border-box', background: '#0A1628', border: '1px solid #1E3A5F', borderRadius: 12, padding: '14px 16px', color: '#F0F4FF', fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = '#FBBF24')}
                onBlur={e => (e.target.style.borderColor = '#1E3A5F')}
              />
            )}
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) setResumeFile(f) }} />
          </div>

          {/* job description */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>
              Job Description <span style={{ color: '#F87171' }}>*</span>
            </label>
            <textarea
              value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here — requirements, responsibilities, tech stack, everything…"
              rows={9}
              style={{ width: '100%', boxSizing: 'border-box', background: '#0A1628', border: '1px solid #1E3A5F', borderRadius: 12, padding: '14px 16px', color: '#F0F4FF', fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = '#FBBF24')}
              onBlur={e => (e.target.style.borderColor = '#1E3A5F')}
            />
            <p style={{ fontSize: 12, color: '#4A5568', marginTop: 6 }}>{jobDesc.length > 0 ? `${jobDesc.length} characters` : 'Paste the complete JD for the best results'}</p>
          </div>

          {/* generate button */}
          <button
            onClick={analyse}
            disabled={!canAnalyse}
            style={{
              width: '100%', padding: '18px', borderRadius: 14, border: 'none',
              cursor: canAnalyse ? 'pointer' : 'not-allowed',
              background: canAnalyse ? 'linear-gradient(135deg,#FBBF24,#F59E0B)' : '#1E3A5F',
              color: canAnalyse ? '#0A1628' : '#4A6FA5',
              fontSize: 16, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: canAnalyse ? '0 0 32px rgba(251,191,36,0.25)' : 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (canAnalyse) (e.currentTarget as HTMLButtonElement).style.opacity = '0.9' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
          >
            <Target size={18} />
            {canAnalyse ? 'Check My Match Score' : 'Add resume + job description to continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function JobMatchPage() {
  return (
    <AuthGate feature="job-match">
      <JobMatchPageInner />
    </AuthGate>
  )
}
