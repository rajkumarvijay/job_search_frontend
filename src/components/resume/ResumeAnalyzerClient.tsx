'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload, CheckCircle, AlertTriangle,
  ChevronDown, ChevronUp, Zap, Star, TrendingUp, Target,
  ExternalLink, Briefcase, MapPin, IndianRupee, ArrowRight,
  Shield, BarChart3, Lightbulb, Code2, FolderGit2, GraduationCap,
  Globe, CheckCircle2,
} from 'lucide-react'
import { resumeApi } from '@/lib/api'
import { AuthGate } from '@/components/auth/AuthGate'
import type {
  ResumeResult, Improvement, RecommendedJob,
  QuickWin, Strength, ExperienceEntry, Project,
} from '@/types'

// --- colour helpers -----------------------------------------------------------
const scoreColor = (s: number) =>
  s >= 80 ? '#4ADE80' : s >= 65 ? '#00C9B1' : s >= 45 ? '#FBBF24' : s >= 30 ? '#FB923C' : '#F87171'

const impactColor: Record<string, string> = {
  High: '#F87171', Medium: '#FBBF24', Low: '#4ADE80',
}

const gradeLabel: Record<string, string> = {
  'A+': 'Excellent', A: 'Very Good', B: 'Good', C: 'Average', D: 'Needs Work', F: 'Major Overhaul',
}

// --- section max scores (must match backend prompt) ---------------------------
const SECTION_MAX: Record<string, number> = {
  contact_info: 10, professional_summary: 15, work_experience: 30,
  skills: 20, education: 15, keywords_and_ats: 10,
}
const SECTION_LABEL: Record<string, string> = {
  contact_info: 'Contact Info', professional_summary: 'Professional Summary',
  work_experience: 'Work Experience', skills: 'Skills Section',
  education: 'Education', keywords_and_ats: 'Keywords & ATS',
}

// --- tiny sub-components -----------------------------------------------------
function Tag({ children, color = '#00C9B1' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 6,
      fontSize: 12, fontWeight: 600,
      background: `${color}18`, border: `1px solid ${color}40`, color,
    }}>{children}</span>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#0F2044', border: '1px solid #1E3A5F',
      borderRadius: 16, padding: 20, ...style,
    }}>{children}</div>
  )
}

function SectionHead({ icon: Icon, title, color = '#00C9B1' }: { icon: React.ElementType; title: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={14} color={color} />
      </div>
      <span style={{ fontWeight: 700, fontSize: 13, color: '#F0F4FF' }}>{title}</span>
    </div>
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
    <div style={{ borderRadius: 12, border: `1px solid ${open ? 'rgba(0,201,177,0.3)' : '#1E3A5F'}`, overflow: 'hidden', transition: 'border-color 0.2s', background: open ? 'rgba(0,201,177,0.02)' : 'transparent' }}>
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

// --- Job Recommendation Card --------------------------------------------------
function RecoJobCard({ job }: { job: RecommendedJob }) {
  const [hovered, setHovered] = useState(false)
  const salary = job.min_salary
    ? `₹${job.min_salary}${job.max_salary ? `–${job.max_salary}` : ''} LPA`
    : null

  return (
    <a
      href={job.job_url || '#'}
      target={job.job_url ? '_blank' : undefined}
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: '#0F2044',
        border: `1px solid ${hovered ? 'rgba(0,201,177,0.35)' : '#1E3A5F'}`,
        borderRadius: 14, padding: 16,
        transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: hovered ? '0 6px 24px rgba(0,201,177,0.08)' : 'none',
      }}
    >
      {/* match badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ minWidth: 0, flex: 1, paddingRight: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: hovered ? '#00C9B1' : '#F0F4FF', lineHeight: 1.3, marginBottom: 3, transition: 'color 0.18s' }}>
            {job.title}
          </div>
          <div style={{ fontSize: 12, color: '#8B9DC3', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Briefcase size={11} />{job.company}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 8, background: `${scoreColor(job.match_score)}18`, border: `1px solid ${scoreColor(job.match_score)}40`, flexShrink: 0 }}>
          <Star size={10} color={scoreColor(job.match_score)} fill={scoreColor(job.match_score)} />
          <span style={{ fontSize: 11, fontWeight: 800, color: scoreColor(job.match_score) }}>{job.match_score}%</span>
        </div>
      </div>

      {/* meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {job.location && (
          <span style={{ fontSize: 11, color: '#8B9DC3', display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={10} />{job.location}
          </span>
        )}
        {salary && (
          <span style={{ fontSize: 11, color: '#4ADE80', display: 'flex', alignItems: 'center', gap: 3 }}>
            <IndianRupee size={10} />{salary}
          </span>
        )}
        {job.is_remote && <Tag color="#A78BFA">Remote</Tag>}
        {job.job_type && <Tag color="#8B9DC3">{job.job_type}</Tag>}
      </div>

      {/* match reason */}
      <p style={{ fontSize: 12, color: '#8B9DC3', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
        {job.match_reason}
      </p>

      {job.job_url && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 12, color: '#00C9B1', fontWeight: 600 }}>
          Apply Now <ExternalLink size={11} />
        </div>
      )}
    </a>
  )
}

// --- Main Component -----------------------------------------------------------
type Stage = 'idle' | 'loading' | 'result'

function ResumeAnalyzerInner() {
  const [stage, setStage]         = useState<Stage>('idle')
  const [dragOver, setDragOver]   = useState(false)
  const [fileName, setFileName]   = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [result, setResult]       = useState<ResumeResult | null>(null)
  const [expanded, setExpanded]   = useState<string | null>('quick_wins')
  const [loadMsg, setLoadMsg]     = useState('Extracting resume content…')
  const fileRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  // Animated loading messages
  useEffect(() => {
    if (stage !== 'loading') return
    const msgs = [
      'Extracting resume content…',
      'Parsing skills & experience…',
      'Scanning for ATS keywords…',
      'Analysing projects & achievements…',
      'Scoring section quality…',
      'Identifying skill gaps…',
      'Generating job recommendations…',
      'Finalising your report…',
    ]
    let i = 0
    const t = setInterval(() => { i = (i + 1) % msgs.length; setLoadMsg(msgs[i]) }, 2500)
    return () => clearInterval(t)
  }, [stage])

  const toggle = (id: string) => setExpanded(p => p === id ? null : id)

  const analyse = useCallback(async (file: File) => {
    setFileName(file.name)
    setStage('loading')
    setResult(null)
    try {
      const { data } = await resumeApi.full(file, targetRole, 6)
      setResult(data)
      setStage('result')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
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
      setStage('result')
    }
  }, [targetRole])

  const onFile = (file: File | undefined) => { if (file) analyse(file) }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) analyse(file)
  }

  // -- idle / upload zone -----------------------------------------------------
  if (stage === 'idle') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', padding: '60px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)', color: '#00C9B1', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
              <Zap size={13} fill="#00C9B1" /> AI-Powered Resume Analyser
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#F0F4FF', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Get Your Resume<br />
              <span style={{ background: 'linear-gradient(135deg,#00C9B1,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ATS Score in Seconds
              </span>
            </h1>
            <p style={{ fontSize: 17, color: '#8B9DC3', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
              Upload your resume and get an instant ATS compatibility score, section-by-section breakdown, improvement tips, and personalised job recommendations — all powered by Gemini AI.
            </p>
          </div>

          {/* target role input */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
              Target Role <span style={{ color: '#4A5568', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional — improves accuracy)</span>
            </label>
            <input
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Senior React Developer, Data Scientist, Product Manager…"
              style={{ width: '100%', background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 12, padding: '12px 16px', color: '#F0F4FF', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = '#00C9B1')}
              onBlur={e => (e.target.style.borderColor = '#1E3A5F')}
            />
          </div>

          {/* drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#00C9B1' : '#1E3A5F'}`,
              borderRadius: 20, padding: '56px 32px', textAlign: 'center',
              cursor: 'pointer', background: dragOver ? 'rgba(0,201,177,0.04)' : 'rgba(15,32,68,0.4)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(0,201,177,0.1)', border: '1px solid rgba(0,201,177,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Upload size={28} color="#00C9B1" />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#F0F4FF', marginBottom: 8 }}>
              {dragOver ? 'Drop it here!' : 'Drag & drop your resume'}
            </p>
            <p style={{ fontSize: 14, color: '#8B9DC3', marginBottom: 20 }}>or click to browse files</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {['PDF', 'DOCX', 'TXT'].map(ext => (
                <span key={ext} style={{ padding: '4px 12px', borderRadius: 6, background: 'rgba(139,157,195,0.1)', border: '1px solid #1E3A5F', fontSize: 12, fontWeight: 700, color: '#8B9DC3' }}>{ext}</span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#4A5568', marginTop: 12 }}>Max 5 MB · Your file is never stored</p>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }} onChange={e => onFile(e.target.files?.[0])} />

          {/* feature pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginTop: 32 }}>
            {[
              { icon: Shield,      label: 'ATS Score',          desc: 'Instant 0–100 rating',           color: '#00C9B1' },
              { icon: BarChart3,   label: 'Section Scores',     desc: '6-category breakdown',            color: '#A78BFA' },
              { icon: Code2,       label: 'Skills Extraction',  desc: 'Tech, tools & soft skills',       color: '#38BDF8' },
              { icon: FolderGit2,  label: 'Projects Analysis',  desc: 'Tech stack & impact review',      color: '#F472B6' },
              { icon: Lightbulb,   label: 'Smart Fixes',        desc: 'Ranked improvement tips',         color: '#FBBF24' },
              { icon: Target,      label: 'Job Matches',        desc: 'AI curated opportunities',        color: '#4ADE80' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(15,32,68,0.6)', border: '1px solid #1E3A5F' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Icon size={15} color={color} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#F0F4FF' }}>{label}</span>
                </div>
                <p style={{ fontSize: 12, color: '#8B9DC3', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // -- loading ----------------------------------------------------------------
  if (stage === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 28px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #1E3A5F' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#00C9B1', animation: 'spin 1s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={28} color="#00C9B1" />
            </div>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF', marginBottom: 10 }}>Analysing Your Resume</h2>
          <p style={{ fontSize: 14, color: '#00C9B1', fontWeight: 600, marginBottom: 8, minHeight: 20, transition: 'opacity 0.3s' }}>{loadMsg}</p>
          <p style={{ fontSize: 13, color: '#8B9DC3' }}>{fileName}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // -- results ----------------------------------------------------------------
  if (!result) return null
  const color = scoreColor(result.ats_score)

  if (result.error) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <AlertTriangle size={40} color="#F87171" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F0F4FF', marginBottom: 8 }}>Analysis Failed</h2>
        <p style={{ fontSize: 14, color: '#8B9DC3', maxWidth: 400, marginBottom: 24 }}>{result.error}</p>
        <button onClick={() => setStage('idle')} style={{ padding: '12px 28px', borderRadius: 12, background: 'rgba(0,201,177,0.1)', border: '1px solid rgba(0,201,177,0.3)', color: '#00C9B1', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
          Try Again
        </button>
      </div>
    )
  }

  const sectionTotal = Object.values(result.section_scores || {}).reduce((a, b) => a + (b || 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', padding: '48px 24px 80px' }} ref={resultRef}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#F0F4FF', marginBottom: 4 }}>Resume Analysis</h1>
            <p style={{ fontSize: 13, color: '#8B9DC3' }}>{fileName}</p>
          </div>
          <button
            onClick={() => { setStage('idle'); setResult(null) }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)', color: '#00C9B1', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            <Upload size={13} /> Analyse Another
          </button>
        </div>

        {/* -- HERO SCORE ROW -- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, marginBottom: 24, background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 20, padding: '28px 32px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* gauge */}
          <div style={{ position: 'relative', width: 120, height: 120 }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1E3A5F" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none"
                stroke={color} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - result.ats_score / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1.2s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1 }}>{result.ats_score}</span>
              <span style={{ fontSize: 11, color: '#8B9DC3' }}>/ 100</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 32, fontWeight: 900, color }}>Grade {result.grade}</span>
              <span style={{ padding: '3px 10px', borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, fontSize: 13, fontWeight: 700, color }}>
                {gradeLabel[result.grade] || ''}
              </span>
              {result.experience_level && (
                <span style={{ padding: '3px 10px', borderRadius: 8, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', fontSize: 13, fontWeight: 600, color: '#A78BFA' }}>
                  {result.experience_level}
                  {result.years_experience ? ` · ${result.years_experience}y exp` : ''}
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, color: '#B0BDD8', lineHeight: 1.65, margin: 0, maxWidth: 580 }}>{result.summary}</p>
            {result.recommended_roles?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                <span style={{ fontSize: 12, color: '#8B9DC3', alignSelf: 'center' }}>Best for:</span>
                {result.recommended_roles.map(r => <Tag key={r}>{r}</Tag>)}
              </div>
            )}
          </div>
        </div>

        {/* -- TWO-COL LAYOUT -- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Section scores */}
            {Object.keys(result.section_scores || {}).length > 0 && (
              <Card>
                <SectionHead icon={BarChart3} title="Section-by-Section Scores" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(result.section_scores).map(([key, val]) => {
                    const max = SECTION_MAX[key] || 10
                    const pct = Math.round((val / max) * 100)
                    const c   = scoreColor(pct)
                    return (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 13, color: '#B0BDD8' }}>{SECTION_LABEL[key] || key}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{val}/{max}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: '#1E3A5F', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: c, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                  <div style={{ borderTop: '1px solid #1E3A5F', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#F0F4FF' }}>Total</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>
                      {sectionTotal} / {Object.values(SECTION_MAX).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick wins */}
            {result.quick_wins?.length > 0 && (
              <Accordion label="⚡ Quick Wins" id="quick_wins" expanded={expanded} onToggle={toggle} badge={result.quick_wins.length}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.quick_wins.map((w, i) => {
                    const isObj = typeof w === 'object' && w !== null
                    const qw = isObj ? w as QuickWin : null
                    return (
                      <div key={i} style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#FBBF24', flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ fontSize: 13, color: '#F0F4FF', lineHeight: 1.5 }}>{qw ? qw.action : String(w)}</span>
                        </div>
                        {qw && (
                          <div style={{ display: 'flex', gap: 10, marginTop: 6, paddingLeft: 22 }}>
                            <span style={{ fontSize: 11, color: '#8B9DC3' }}>⏱ {qw.time_required}</span>
                            <span style={{ fontSize: 11, color: '#4ADE80', fontWeight: 700 }}>{qw.score_impact}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Accordion>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <Accordion label="🔧 Improvements" id="improvements" expanded={expanded} onToggle={toggle} badge={result.improvements.length}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.improvements.map((imp: Improvement, i) => (
                    <div key={i} style={{ padding: 14, borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid #1E3A5F' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#F0F4FF' }}>{imp.category}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${impactColor[imp.impact] ?? '#8B9DC3'}20`, color: impactColor[imp.impact] ?? '#8B9DC3' }}>
                          {imp.impact} Impact
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: '#F87171', margin: '0 0 5px' }}>❌ {imp.issue}</p>
                      <p style={{ fontSize: 12, color: '#4ADE80', margin: 0 }}>✓ {imp.fix}</p>
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <Accordion label="✅ Strengths" id="strengths" expanded={expanded} onToggle={toggle} badge={result.strengths.length}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.strengths.map((s, i) => {
                    const isObj = typeof s === 'object' && s !== null
                    const st = isObj ? s as Strength : null
                    return (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)' }}>
                        <CheckCircle size={14} color="#4ADE80" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                          {st ? (
                            <>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#4ADE80', marginBottom: 2 }}>{st.title}</div>
                              <div style={{ fontSize: 12, color: '#A8C0E0', lineHeight: 1.5 }}>{st.explanation}</div>
                            </>
                          ) : (
                            <span style={{ fontSize: 13, color: '#4ADE80', lineHeight: 1.5 }}>{String(s)}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Accordion>
            )}

            {/* Format issues */}
            {result.format_issues?.length > 0 && (
              <Accordion label="📐 Format Issues" id="format" expanded={expanded} onToggle={toggle} badge={result.format_issues.length}>
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.format_issues.map((f, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#FB923C', lineHeight: 1.5 }}>{f}</li>
                  ))}
                </ul>
              </Accordion>
            )}

            {/* Experience Breakdown */}
            {result.experience_breakdown && result.experience_breakdown.length > 0 && (
              <Accordion label="💼 Experience Breakdown" id="experience" expanded={expanded} onToggle={toggle} badge={result.experience_breakdown.length}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(result.experience_breakdown as ExperienceEntry[]).map((exp, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.15)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#F0F4FF' }}>{exp.title}</div>
                          <div style={{ fontSize: 12, color: '#38BDF8', marginTop: 2 }}>{exp.company} · {exp.duration}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {[1,2,3,4,5,6,7,8,9,10].slice(0,10).map(n => (
                              <div key={n} style={{ width: 6, height: 6, borderRadius: 2, background: n <= (exp.impact_score || 0) ? '#38BDF8' : '#1E3A5F' }} />
                            ))}
                          </div>
                          <span style={{ fontSize: 10, color: '#8B9DC3' }}>Impact {exp.impact_score}/10</span>
                        </div>
                      </div>
                      {!exp.is_quantified && (
                        <div style={{ fontSize: 11, color: '#FBBF24', marginBottom: 6 }}>⚠ No quantified achievements — add numbers to boost score</div>
                      )}
                      {exp.key_achievements?.length > 0 && (
                        <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {exp.key_achievements.map((ach, j) => (
                            <li key={j} style={{ fontSize: 12, color: '#A8C0E0', lineHeight: 1.5 }}>{ach}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {/* Projects */}
            {result.projects && result.projects.length > 0 && (
              <Accordion label="🚀 Projects" id="projects" expanded={expanded} onToggle={toggle} badge={result.projects.length}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(result.projects as Project[]).map((proj, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(244,114,182,0.04)', border: '1px solid rgba(244,114,182,0.15)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#F0F4FF' }}>{proj.name}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {proj.github_mentioned && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(74,222,128,0.1)', color: '#4ADE80', fontWeight: 700 }}>GitHub ✓</span>}
                          {proj.has_metrics ? (
                            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(0,201,177,0.1)', color: '#00C9B1', fontWeight: 700 }}>Metrics ✓</span>
                          ) : (
                            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(251,191,36,0.1)', color: '#FBBF24', fontWeight: 700 }}>No Metrics</span>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: '#A8C0E0', margin: '0 0 10px', lineHeight: 1.55 }}>{proj.description}</p>
                      {proj.tech_stack?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {proj.tech_stack.map(tech => (
                            <span key={tech} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.25)', color: '#F472B6', fontWeight: 600 }}>{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {/* India job market tips */}
            {result.indian_job_market_tips && result.indian_job_market_tips.length > 0 && (
              <Accordion label="🇮🇳 Indian Job Market Tips" id="india_tips" expanded={expanded} onToggle={toggle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.indian_job_market_tips.map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'rgba(255,119,85,0.05)', border: '1px solid rgba(255,119,85,0.2)' }}>
                      <Globe size={14} color="#FF7755" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13, color: '#A8C0E0', lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {/* Job recommendations */}
            {result.recommended_jobs && result.recommended_jobs.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={14} color="#4ADE80" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#F0F4FF' }}>
                    AI Job Recommendations
                  </span>
                  <span style={{ fontSize: 12, color: '#8B9DC3' }}>matched to your profile</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
                  {result.recommended_jobs.map((job: RecommendedJob) => (
                    <RecoJobCard key={job.job_id} job={job} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — sticky sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 }}>

            {/* Skills breakdown */}
            {result.extracted_skills && (
              Object.values(result.extracted_skills).some(arr => arr.length > 0)
            ) ? (
              <Card>
                <SectionHead icon={Code2} title="Skills Breakdown" color="#38BDF8" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {result.extracted_skills.technical.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Technical</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {result.extracted_skills.technical.map(s => <Tag key={s} color="#38BDF8">{s}</Tag>)}
                      </div>
                    </div>
                  )}
                  {result.extracted_skills.tools.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Tools & Platforms</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {result.extracted_skills.tools.map(s => <Tag key={s} color="#A78BFA">{s}</Tag>)}
                      </div>
                    </div>
                  )}
                  {result.extracted_skills.soft.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Soft Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {result.extracted_skills.soft.map(s => <Tag key={s} color="#4ADE80">{s}</Tag>)}
                      </div>
                    </div>
                  )}
                  {result.extracted_skills.certifications.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Certifications</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {result.extracted_skills.certifications.map(s => <Tag key={s} color="#FBBF24">{s}</Tag>)}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : result.top_skills?.length > 0 ? (
              <Card>
                <SectionHead icon={Star} title="Top Skills Detected" color="#FBBF24" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.top_skills.map(sk => <Tag key={sk} color="#FBBF24">{sk}</Tag>)}
                </div>
              </Card>
            ) : null}

            {/* Recommended keywords */}
            {result.recommended_keywords?.length > 0 && (
              <Card>
                <SectionHead icon={TrendingUp} title="Add These Keywords" color="#A78BFA" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {result.recommended_keywords.map(kw => <Tag key={kw} color="#A78BFA">{kw}</Tag>)}
                </div>
                <p style={{ fontSize: 12, color: '#8B9DC3', margin: 0, lineHeight: 1.5 }}>
                  Adding these keywords can significantly boost your ATS pass rate.
                </p>
              </Card>
            )}

            {/* Missing keywords */}
            {result.missing_keywords?.length > 0 && (
              <Card>
                <SectionHead icon={AlertTriangle} title="Missing Keywords" color="#F87171" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.missing_keywords.map(kw => <Tag key={kw} color="#F87171">{kw}</Tag>)}
                </div>
              </Card>
            )}

            {/* Education */}
            {result.education && result.education.length > 0 && (
              <Card>
                <SectionHead icon={GraduationCap} title="Education" color="#FBBF24" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.education.map((edu, i) => (
                    <div key={i} style={{ paddingBottom: i < result.education!.length - 1 ? 10 : 0, borderBottom: i < result.education!.length - 1 ? '1px solid #1E3A5F' : 'none' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F4FF' }}>{edu.degree}</div>
                      <div style={{ fontSize: 12, color: '#8B9DC3', marginTop: 2 }}>{edu.institution}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        {edu.year && <span style={{ fontSize: 11, color: '#4A6FA5' }}>{edu.year}</span>}
                        {edu.gpa_cgpa && <span style={{ fontSize: 11, color: '#00C9B1', fontWeight: 600 }}>CGPA: {edu.gpa_cgpa}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Keyword density */}
            {result.keyword_density?.present && result.keyword_density.present.length > 0 && (
              <Card>
                <SectionHead icon={CheckCircle2} title="Keywords Already Present" color="#4ADE80" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {result.keyword_density.present.map(kw => <Tag key={kw} color="#4ADE80">{kw}</Tag>)}
                </div>
              </Card>
            )}

            {/* Search jobs CTA */}
            <Card style={{ background: 'linear-gradient(135deg,rgba(0,201,177,0.08),rgba(167,139,250,0.06))', border: '1px solid rgba(0,201,177,0.25)' }}>
              <div style={{ textAlign: 'center' }}>
                <Briefcase size={24} color="#00C9B1" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F4FF', marginBottom: 6 }}>Find Real Jobs</p>
                <p style={{ fontSize: 12, color: '#8B9DC3', marginBottom: 16, lineHeight: 1.5 }}>
                  Search live listings across LinkedIn, Naukri, Indeed and more.
                </p>
                {result.recommended_roles?.length > 0 && (
                  <a
                    href={`/search?q=${encodeURIComponent(result.recommended_roles[0])}&location=India`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 0', borderRadius: 10, background: '#00C9B1', color: '#0A1628', fontWeight: 700, fontSize: 13, textDecoration: 'none', transition: 'opacity 0.18s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Search {result.recommended_roles[0]} Jobs <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ResumeAnalyzerClient() {
  return (
    <AuthGate feature="resume">
      <ResumeAnalyzerInner />
    </AuthGate>
  )
}
