'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Upload, FileText, Zap, Copy, Download, CheckCircle2,
  AlertTriangle, Sparkles, ChevronDown, Target, Lightbulb,
  RotateCcw, X, Briefcase, User, Building2,
} from 'lucide-react'
import { coverLetterApi } from '@/lib/api'
import type { CoverLetterResult } from '@/types'

const TONES = ['Professional', 'Enthusiastic', 'Confident', 'Creative', 'Formal']

const scoreColor = (n: number) =>
  n >= 350 ? '#4ADE80' : n >= 250 ? '#00C9B1' : n >= 150 ? '#FBBF24' : '#FB923C'

function Tag({ children, color = '#00C9B1' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 6,
      fontSize: 12, fontWeight: 600,
      background: `${color}18`, border: `1px solid ${color}40`, color,
    }}>{children}</span>
  )
}

export default function CoverLetterPage() {
  // form state
  const [resumeFile, setResumeFile]       = useState<File | null>(null)
  const [resumeText, setResumeText]       = useState('')
  const [resumeMode, setResumeMode]       = useState<'file' | 'text'>('file')
  const [jobDesc, setJobDesc]             = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [companyName, setCompanyName]     = useState('')
  const [jobTitle, setJobTitle]           = useState('')
  const [tone, setTone]                   = useState('Professional')
  const [dragOver, setDragOver]           = useState(false)

  // result state
  const [stage, setStage]     = useState<'idle' | 'loading' | 'result'>('idle')
  const [result, setResult]   = useState<CoverLetterResult | null>(null)
  const [copied, setCopied]   = useState(false)
  const [loadMsg, setLoadMsg] = useState('Reading your resume…')

  const fileRef   = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const generate = useCallback(async () => {
    if (!jobDesc.trim()) return
    if (resumeMode === 'file' && !resumeFile) return
    if (resumeMode === 'text' && !resumeText.trim()) return

    setStage('loading')
    setResult(null)

    const msgs = [
      'Reading your resume…',
      'Analysing job description…',
      'Matching your skills to requirements…',
      'Crafting your opening hook…',
      'Writing tailored paragraphs…',
      'Polishing the final letter…',
    ]
    let i = 0
    setLoadMsg(msgs[0])
    const t = setInterval(() => { i = (i + 1) % msgs.length; setLoadMsg(msgs[i]) }, 2200)

    try {
      const { data } = await coverLetterApi.generate({
        job_description: jobDesc,
        candidate_name:  candidateName,
        company_name:    companyName,
        job_title:       jobTitle,
        tone,
        file:            resumeMode === 'file' ? resumeFile! : null,
        resume_text:     resumeMode === 'text' ? resumeText : '',
      })
      clearInterval(t)
      setResult(data)
      setStage('result')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (e: unknown) {
      clearInterval(t)
      let msg = 'Generation failed. Please try again.'
      if (e && typeof e === 'object') {
        const ae = e as { response?: { data?: { detail?: string } }; message?: string }
        msg = ae.response?.data?.detail || ae.message || msg
      }
      setResult({ cover_letter: '', subject_line: '', key_matches: [], tone_used: tone, word_count: 0, tips: [], error: msg })
      setStage('result')
    }
  }, [resumeFile, resumeText, resumeMode, jobDesc, candidateName, companyName, jobTitle, tone])

  const reset = () => {
    setStage('idle')
    setResult(null)
    setResumeFile(null)
    setJobDesc('')
  }

  const copyLetter = async () => {
    if (!result?.cover_letter) return
    await navigator.clipboard.writeText(result.cover_letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const downloadLetter = () => {
    if (!result?.cover_letter) return
    const name = candidateName ? `Cover_Letter_${candidateName.replace(/\s+/g, '_')}` : 'Cover_Letter'
    const blob = new Blob([result.cover_letter], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `${name}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (stage === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ position: 'relative', width: 88, height: 88, margin: '0 auto 28px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #1E3A5F' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#A78BFA', animation: 'spin 1s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={30} color="#A78BFA" />
            </div>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF', marginBottom: 10 }}>Writing Your Cover Letter</h2>
          <p style={{ fontSize: 14, color: '#A78BFA', fontWeight: 600, marginBottom: 8, minHeight: 20 }}>{loadMsg}</p>
          <p style={{ fontSize: 13, color: '#8B9DC3' }}>Powered by Gemini AI · Usually takes 10–20 seconds</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (stage === 'result' && result) {
    if (result.error) {
      return (
        <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <AlertTriangle size={40} color="#F87171" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F0F4FF', marginBottom: 8 }}>Generation Failed</h2>
          <p style={{ fontSize: 14, color: '#8B9DC3', maxWidth: 400, marginBottom: 24 }}>{result.error}</p>
          <button onClick={reset} style={{ padding: '12px 28px', borderRadius: 12, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#A78BFA', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            Try Again
          </button>
        </div>
      )
    }

    const wc    = result.word_count || result.cover_letter.split(' ').length
    const wcCol = scoreColor(wc)

    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', padding: '48px 24px 80px' }} ref={resultRef}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#F0F4FF', marginBottom: 4 }}>Your Cover Letter</h1>
              <p style={{ fontSize: 13, color: '#8B9DC3' }}>
                {jobTitle && companyName ? `${jobTitle} at ${companyName}` : jobTitle || companyName || 'Ready to send'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={copyLetter} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(0,201,177,0.08)', border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(0,201,177,0.25)'}`, color: copied ? '#4ADE80' : '#00C9B1', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={downloadLetter} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)', color: '#A78BFA', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <Download size={14} /> Download
              </button>
              <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, background: 'transparent', border: '1px solid #1E3A5F', color: '#8B9DC3', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <RotateCcw size={13} /> Generate Again
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 20, alignItems: 'start' }}>

            {/* LEFT — the letter */}
            <div>
              {/* subject line */}
              {result.subject_line && (
                <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suggested Subject Line</span>
                  <p style={{ fontSize: 14, color: '#F0F4FF', margin: '6px 0 0', fontWeight: 600 }}>{result.subject_line}</p>
                </div>
              )}

              {/* letter body */}
              <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 20, padding: '36px 40px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, right: 20, display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${wcCol}18`, color: wcCol, fontWeight: 700 }}>{wc} words</span>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(167,139,250,0.1)', color: '#A78BFA', fontWeight: 700 }}>{result.tone_used}</span>
                </div>
                <pre style={{
                  fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  fontSize: 15, color: '#D4E0F0', lineHeight: 1.85, margin: 0,
                }}>
                  {result.cover_letter}
                </pre>
              </div>

              {/* copy CTA at bottom */}
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button onClick={copyLetter} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 12, background: '#A78BFA', color: '#0A1628', cursor: 'pointer', fontSize: 15, fontWeight: 800, border: 'none', transition: 'opacity 0.18s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />} {copied ? 'Copied to Clipboard!' : 'Copy Cover Letter'}
                </button>
                <button onClick={downloadLetter} style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#A78BFA', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* RIGHT — sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 }}>

              {/* key matches */}
              {result.key_matches?.length > 0 && (
                <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,201,177,0.1)', border: '1px solid rgba(0,201,177,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Target size={14} color="#00C9B1" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#F0F4FF' }}>JD Matches Used</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {result.key_matches.map((match, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <CheckCircle2 size={13} color="#00C9B1" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, color: '#A8C0E0', lineHeight: 1.45 }}>{match}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* tips */}
              {result.tips?.length > 0 && (
                <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lightbulb size={14} color="#FBBF24" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#F0F4FF' }}>Before You Send</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.tips.map((tip, i) => (
                      <div key={i} style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.18)' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#FBBF24', marginRight: 6 }}>{i + 1}.</span>
                        <span style={{ fontSize: 12, color: '#A8C0E0', lineHeight: 1.5 }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* search jobs CTA */}
              <div style={{ background: 'linear-gradient(135deg,rgba(167,139,250,0.08),rgba(0,201,177,0.05))', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <Briefcase size={22} color="#A78BFA" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F4FF', marginBottom: 6 }}>Find the Job to Apply For</p>
                <p style={{ fontSize: 12, color: '#8B9DC3', marginBottom: 14, lineHeight: 1.5 }}>Search live listings across 6 portals in one click.</p>
                <a href={`/search?q=${encodeURIComponent(jobTitle || '')}&location=India`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 10, background: '#A78BFA', color: '#0A1628', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  Search Jobs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── FORM (idle) ───────────────────────────────────────────────────────────────
  const canGenerate = jobDesc.trim().length > 50 && (
    (resumeMode === 'file' && !!resumeFile) ||
    (resumeMode === 'text' && resumeText.trim().length > 100)
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', padding: '56px 24px 80px' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>

        {/* page header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, marginBottom: 20, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)', color: '#A78BFA', fontSize: 13, fontWeight: 600 }}>
            <Sparkles size={13} /> AI-Powered
          </div>
          <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 900, letterSpacing: '-0.035em', color: '#F0F4FF', lineHeight: 1.1, marginBottom: 16 }}>
            Cover Letter{' '}
            <span style={{ background: 'linear-gradient(90deg,#A78BFA,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Generator
            </span>
          </h1>
          <p style={{ fontSize: 17, color: '#8B9DC3', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Upload your resume + paste the job description. Get a tailored, professional cover letter in one click — powered by Gemini AI.
          </p>

          {/* feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 24 }}>
            {['✅ Tailored to the JD', '🤖 Gemini AI', '⚡ 10–20 seconds', '📋 Copy & download', '🔒 Free, no sign-up'].map(p => (
              <span key={p} style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)', color: '#A8C0E0' }}>{p}</span>
            ))}
          </div>
        </div>

        {/* FORM CARD */}
        <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 24, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* optional fields row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
            {[
              { icon: User,      placeholder: 'Your Name (e.g. Priya Sharma)',     val: candidateName, set: setCandidateName },
              { icon: Building2, placeholder: 'Company Name (e.g. Razorpay)',       val: companyName,   set: setCompanyName   },
              { icon: Briefcase, placeholder: 'Job Title (e.g. Senior SDE)',        val: jobTitle,      set: setJobTitle       },
            ].map(({ icon: Icon, placeholder, val, set }) => (
              <div key={placeholder} style={{ position: 'relative' }}>
                <Icon size={14} color="#4A6FA5" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  value={val} onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0A1628', border: '1px solid #1E3A5F', borderRadius: 10, padding: '11px 12px 11px 34px', color: '#F0F4FF', fontSize: 13, outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = '#A78BFA')}
                  onBlur={e => (e.target.style.borderColor = '#1E3A5F')}
                />
              </div>
            ))}
          </div>

          {/* tone selector */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>
              Tone
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)} style={{
                  padding: '7px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.18s',
                  background: tone === t ? '#A78BFA' : 'rgba(167,139,250,0.06)',
                  color: tone === t ? '#0A1628' : '#A78BFA',
                  outline: tone === t ? 'none' : '1px solid rgba(167,139,250,0.25)',
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* divider */}
          <div style={{ borderTop: '1px solid #1E3A5F' }} />

          {/* resume input */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Your Resume <span style={{ color: '#F87171' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['file', 'text'] as const).map(m => (
                  <button key={m} onClick={() => setResumeMode(m)} style={{ padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: resumeMode === m ? 'rgba(0,201,177,0.15)' : 'transparent', color: resumeMode === m ? '#00C9B1' : '#4A6FA5' }}>
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
                style={{ border: `2px dashed ${dragOver ? '#00C9B1' : resumeFile ? 'rgba(0,201,177,0.5)' : '#1E3A5F'}`, borderRadius: 14, padding: '28px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(0,201,177,0.04)' : 'rgba(10,22,40,0.5)', transition: 'all 0.2s' }}
              >
                {resumeFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <FileText size={20} color="#00C9B1" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#00C9B1' }}>{resumeFile.name}</span>
                    <button onClick={e => { e.stopPropagation(); setResumeFile(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F87171', padding: 0 }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={24} color="#4A6FA5" style={{ margin: '0 auto 10px' }} />
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F4FF', margin: '0 0 4px' }}>
                      {dragOver ? 'Drop it here!' : 'Drag & drop or click to upload'}
                    </p>
                    <p style={{ fontSize: 12, color: '#8B9DC3', margin: 0 }}>PDF · DOCX · TXT · Max 5 MB</p>
                  </>
                )}
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your resume text here — include your experience, skills, education, and projects…"
                rows={8}
                style={{ width: '100%', boxSizing: 'border-box', background: '#0A1628', border: '1px solid #1E3A5F', borderRadius: 12, padding: '14px 16px', color: '#F0F4FF', fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = '#00C9B1')}
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
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here — the more detail you give, the better the cover letter…"
              rows={9}
              style={{ width: '100%', boxSizing: 'border-box', background: '#0A1628', border: '1px solid #1E3A5F', borderRadius: 12, padding: '14px 16px', color: '#F0F4FF', fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = '#A78BFA')}
              onBlur={e => (e.target.style.borderColor = '#1E3A5F')}
            />
            <p style={{ fontSize: 12, color: '#4A5568', marginTop: 6 }}>{jobDesc.length > 0 ? `${jobDesc.length} characters` : 'Minimum ~50 characters'}</p>
          </div>

          {/* generate button */}
          <button
            onClick={generate}
            disabled={!canGenerate}
            style={{
              width: '100%', padding: '18px', borderRadius: 14, border: 'none', cursor: canGenerate ? 'pointer' : 'not-allowed',
              background: canGenerate ? 'linear-gradient(135deg,#A78BFA,#7C3AED)' : '#1E3A5F',
              color: canGenerate ? '#fff' : '#4A6FA5',
              fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: canGenerate ? '0 0 32px rgba(167,139,250,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (canGenerate) (e.currentTarget as HTMLButtonElement).style.opacity = '0.9' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
          >
            <Sparkles size={18} />
            {canGenerate ? 'Generate Cover Letter' : 'Add resume + job description to continue'}
            <ChevronDown size={16} style={{ opacity: 0.7 }} />
          </button>

          {!canGenerate && (jobDesc.length > 0 || resumeFile || resumeText.length > 0) && (
            <p style={{ fontSize: 12, color: '#8B9DC3', textAlign: 'center', marginTop: -16 }}>
              {!resumeFile && !resumeText ? '⬆ Add your resume' : jobDesc.length < 50 ? '⬆ Job description too short — paste more detail' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
