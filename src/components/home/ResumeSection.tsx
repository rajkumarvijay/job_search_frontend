'use client'

import { Shield, BarChart3, Lightbulb, Target, CheckCircle2 } from 'lucide-react'

const FEATURES = [
  { icon: Shield,    label: 'ATS Score',         desc: 'Instant 0–100 compatibility rating',  color: '#00C9B1' },
  { icon: BarChart3, label: 'Section Breakdown',  desc: 'Score each part of your resume',      color: '#A78BFA' },
  { icon: Lightbulb, label: 'Ranked Fixes',       desc: 'Prioritised, actionable improvements', color: '#FBBF24' },
  { icon: Target,    label: 'Job Matches',        desc: 'AI-curated roles for your profile',   color: '#4ADE80' },
]

const KEY_POINTS = [
  { text: 'Over 90 % of recruiters use ATS software — a low score means your resume is filtered out before any human reads it.' },
  { text: 'Get a detailed section-by-section breakdown: contact info, summary, experience, skills, education, and keyword density.' },
  { text: 'Receive a prioritised fix list — high-impact changes first — so you spend time on what actually moves the needle.' },
  { text: 'AI matches your profile to live job listings and surfaces roles where your resume is already a strong fit.' },
  { text: 'Supports PDF, DOCX, and TXT formats. Analysis completes in under 30 seconds, powered by Gemini AI.' },
]

export function ResumeSection() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="sec-label">AI-Powered</div>
          <h2 className="sec-title">Resume Score &amp; Recommendations</h2>
          <p className="sec-sub">
            Upload your resume and get an instant ATS score, improvement tips, and personalised job matches — all powered by Gemini AI.
          </p>
        </div>

        {/* two-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, alignItems: 'center' }}>

          {/* key points card */}
          <div style={{
            background: 'linear-gradient(135deg,rgba(0,201,177,0.06) 0%,rgba(167,139,250,0.04) 100%)',
            border: '1px solid rgba(0,201,177,0.2)',
            borderRadius: 24, padding: 36,
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#F0F4FF', marginBottom: 6, letterSpacing: '-0.02em' }}>
              Why your ATS score matters
            </h3>
            <p style={{ fontSize: 13, color: '#8B9DC3', marginBottom: 28, lineHeight: 1.6 }}>
              Most applications are rejected automatically — before a recruiter ever sees them. Here&apos;s what our analyser checks:
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {KEY_POINTS.map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={17} color="#00C9B1" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: '#A8C0E0', lineHeight: 1.65 }}>{pt.text}</span>
                </li>
              ))}
            </ul>

            {/* SEO trust signals */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                '✅ Free ATS Resume Checker',
                '🤖 Powered by Gemini AI',
                '⚡ Results in 30 seconds',
                '📄 PDF · DOCX · TXT',
                '🔒 No sign-up required',
                '🇮🇳 Optimised for Indian Job Market',
              ].map(tag => (
                <span key={tag} style={{
                  padding: '6px 14px', borderRadius: 999,
                  background: 'rgba(0,201,177,0.07)', border: '1px solid rgba(0,201,177,0.2)',
                  fontSize: 12, fontWeight: 600, color: '#A8C0E0',
                  whiteSpace: 'nowrap',
                }}>
                  {tag}
                </span>
              ))}
            </div>
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
