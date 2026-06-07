'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Zap, ArrowRight, Shield, BarChart3, Lightbulb, Target } from 'lucide-react'

const FEATURES = [
  { icon: Shield,    label: 'ATS Score',         desc: 'Instant 0–100 compatibility rating',  color: '#00C9B1' },
  { icon: BarChart3, label: 'Section Breakdown',  desc: 'Score each part of your resume',      color: '#A78BFA' },
  { icon: Lightbulb, label: 'Ranked Fixes',       desc: 'Prioritised, actionable improvements', color: '#FBBF24' },
  { icon: Target,    label: 'Job Matches',        desc: 'AI-curated roles for your profile',   color: '#4ADE80' },
]

export function ResumeSection() {
  const router  = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    // Store the file in sessionStorage (as base64) and navigate to /resume
    const reader = new FileReader()
    reader.onload = () => {
      try {
        sessionStorage.setItem('pending_resume_name', file.name)
        sessionStorage.setItem('pending_resume_type', file.type)
        sessionStorage.setItem('pending_resume_data', reader.result as string)
      } catch {
        /* sessionStorage might be full — just navigate */
      }
      router.push('/resume')
    }
    reader.readAsDataURL(file)
  }

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="sec-label">AI-Powered</div>
          <h2 className="sec-title">Resume Score & Recommendations</h2>
          <p className="sec-sub">
            Upload your resume and get an instant ATS score, improvement tips, and personalised job matches — all powered by Gemini AI.
          </p>
        </div>

        {/* two-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, alignItems: 'center' }}>

          {/* upload card */}
          <div style={{
            background: 'linear-gradient(135deg,rgba(0,201,177,0.06) 0%,rgba(167,139,250,0.04) 100%)',
            border: '1px solid rgba(0,201,177,0.2)',
            borderRadius: 24, padding: 36, textAlign: 'center',
          }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(0,201,177,0.1)', border: '1px solid rgba(0,201,177,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Zap size={32} color="#00C9B1" />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF', marginBottom: 10, letterSpacing: '-0.02em' }}>
              Analyse Your Resume Free
            </h3>
            <p style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.65, marginBottom: 28, maxWidth: 340, margin: '0 auto 28px' }}>
              Drop your PDF or DOCX and get a detailed ATS report in under 30 seconds.
            </p>

            {/* drop / upload zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor = '#00C9B1' }}
              onDragLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,201,177,0.25)' }}
              onDrop={e => {
                e.preventDefault()
                ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,201,177,0.25)'
                handleFile(e.dataTransfer.files[0])
              }}
              style={{ border: '2px dashed rgba(0,201,177,0.25)', borderRadius: 14, padding: '28px 20px', cursor: 'pointer', transition: 'border-color 0.2s', marginBottom: 16 }}
            >
              <Upload size={22} color="#00C9B1" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F4FF', margin: '0 0 4px' }}>Drag & drop your resume</p>
              <p style={{ fontSize: 12, color: '#8B9DC3', margin: 0 }}>PDF · DOCX · TXT · up to 5 MB</p>
            </div>

            <input
              ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files?.[0])}
            />

            <button
              onClick={() => router.push('/resume')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '13px', borderRadius: 12, background: '#00C9B1', border: 'none', color: '#0A1628', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'opacity 0.18s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Open Resume Analyser <ArrowRight size={15} />
            </button>
          </div>

          {/* feature grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
            {FEATURES.map(({ icon: Icon, label, desc, color }) => (
              <div
                key={label}
                style={{
                  padding: 22, borderRadius: 16,
                  background: `linear-gradient(135deg,${color}0A 0%,rgba(15,32,68,0.8) 100%)`,
                  border: `1px solid ${color}28`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(-3px)'
                  el.style.boxShadow = `0 12px 32px ${color}14`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#F0F4FF', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 13, color: '#8B9DC3', lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
