'use client'

import { useUser } from '@clerk/nextjs'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Lock, Sparkles, FileText, Target, PenLine, CheckCircle2 } from 'lucide-react'

const FEATURE_META: Record<string, {
  icon: React.ElementType
  color: string
  title: string
  subtitle: string
  perks: string[]
}> = {
  resume: {
    icon: FileText,
    color: '#00C9B1',
    title: 'Resume ATS Scorer',
    subtitle: 'Get your free AI-powered resume score',
    perks: [
      'Instant 0–100 ATS compatibility score',
      'Section-by-section breakdown with fix suggestions',
      'Missing keywords & recommended additions',
      'AI-curated job matches based on your profile',
    ],
  },
  'cover-letter': {
    icon: PenLine,
    color: '#A78BFA',
    title: 'AI Cover Letter Generator',
    subtitle: 'Generate a tailored cover letter in one click',
    perks: [
      'Personalised to the exact job description',
      'Matches your resume skills to JD requirements',
      'Professional tone with no clichés',
      'Suggested email subject line + personalisation tips',
    ],
  },
  'job-match': {
    icon: Target,
    color: '#FBBF24',
    title: 'Job Match Score',
    subtitle: 'See how well your resume fits the role',
    perks: [
      '0–100 match score with grade (Excellent → Weak)',
      'Matched & missing skills with proficiency levels',
      'Strengths aligned to the JD requirements',
      'Personalised learning path to close skill gaps',
    ],
  },
}

interface AuthGateProps {
  feature: 'resume' | 'cover-letter' | 'job-match'
  children: React.ReactNode
}

export function AuthGate({ feature, children }: AuthGateProps) {
  const { isLoaded, isSignedIn } = useUser()

  // Still loading — show nothing to avoid flash
  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #1E3A5F', borderTopColor: '#00C9B1', animation: 'spin 0.9s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Signed in — render the actual page
  if (isSignedIn) return <>{children}</>

  // Not signed in — show gate
  const meta = FEATURE_META[feature]
  const Icon = meta.icon
  const color = meta.color

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>

        {/* Lock badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, marginBottom: 28, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#F87171', fontSize: 13, fontWeight: 600 }}>
          <Lock size={13} /> Sign in to unlock this feature
        </div>

        {/* Feature icon */}
        <div style={{ width: 80, height: 80, borderRadius: 22, background: `${color}15`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Icon size={36} color={color} />
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: '#F0F4FF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10 }}>
          {meta.title}
        </h1>
        <p style={{ fontSize: 16, color: '#8B9DC3', marginBottom: 32, lineHeight: 1.6 }}>
          {meta.subtitle} — free, forever.
        </p>

        {/* Perks */}
        <div style={{ background: '#0F2044', border: `1px solid ${color}25`, borderRadius: 20, padding: '24px 28px', marginBottom: 32, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={12} /> What you get
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {meta.perks.map((perk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={16} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 14, color: '#C8D8F0', lineHeight: 1.5 }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SignUpButton mode="modal">
            <button style={{
              width: '100%', padding: '16px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${color}, ${color}CC)`,
              color: '#0A1628', fontSize: 16, fontWeight: 800,
              boxShadow: `0 0 28px ${color}30`,
              transition: 'opacity 0.18s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Create Free Account
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button style={{
              width: '100%', padding: '15px', borderRadius: 14, border: `1.5px solid #1E3A5F`, cursor: 'pointer',
              background: 'transparent', color: '#F0F4FF', fontSize: 15, fontWeight: 700,
              transition: 'border-color 0.18s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E3A5F')}
            >
              Already have an account? Sign in
            </button>
          </SignInButton>
        </div>

        <p style={{ fontSize: 12, color: '#4A5568', marginTop: 20 }}>
          No credit card required · 100% free · Takes 30 seconds
        </p>
      </div>
    </div>
  )
}
