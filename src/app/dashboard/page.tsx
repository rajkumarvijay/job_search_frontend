'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  Search, Bookmark, PlusCircle, FileText,
  Crown, ChevronRight, MapPin, Briefcase,
  Sparkles, Calendar, Mail, User,
} from 'lucide-react'
import Image from 'next/image'

/* ── Explore cards ──────────────────────────────────────────────────────── */
const EXPLORE = [
  {
    href: '/search',
    icon: Search,
    label: 'Search Jobs',
    desc: 'Find and filter jobs across LinkedIn, Indeed, Naukri and more.',
    color: '#00C9B1',
    gradient: 'rgba(0,201,177,0.08)',
    border: 'rgba(0,201,177,0.2)',
  },
  {
    href: '/saved',
    icon: Bookmark,
    label: 'Saved Jobs',
    desc: 'All the job listings you have bookmarked, in one place.',
    color: '#38BDF8',
    gradient: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.2)',
  },
  {
    href: '/post-job',
    icon: PlusCircle,
    label: 'Post a Job',
    desc: 'Hiring or sharing an opportunity? Post a free listing in minutes.',
    color: '#A78BFA',
    gradient: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
  },
  {
    href: '/resume',
    icon: FileText,
    label: 'Resume Score',
    desc: 'Upload your resume and get an instant AI-powered ATS score.',
    color: '#4ADE80',
    gradient: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.2)',
  },
  {
    href: '/pricing',
    icon: Crown,
    label: 'Plans & Pricing',
    desc: 'Unlock advanced filters, priority listings, and more.',
    color: '#FBBF24',
    gradient: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
  },
]

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function formatDate(d: Date | null | undefined) {
  if (!d) return '—'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Skeleton({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, #1E3A5F 25%, #253F6A 50%, #1E3A5F 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  // Redirect to home if not signed in (once Clerk has loaded)
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/')
  }, [isLoaded, isSignedIn, router])

  const email     = user?.primaryEmailAddress?.emailAddress ?? ''
  const fullName  = user?.fullName || user?.firstName || 'there'
  const initials  = (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')
  const joinedAt  = user?.createdAt ? new Date(user.createdAt) : null

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* ── Back button ────────────────────────────────────────────── */}
        <button
          onClick={() => router.back()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            marginBottom: 28, padding: '8px 16px', borderRadius: 10,
            background: 'transparent', border: '1px solid #1E3A5F',
            color: '#8B9DC3', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = '#4A6FA5'
            el.style.color = '#F0F4FF'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.borderColor = '#1E3A5F'
            el.style.color = '#8B9DC3'
          }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* ── Page title ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 16,
            background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.22)',
            color: '#00C9B1', fontSize: 13, fontWeight: 600,
          }}>
            <Sparkles size={13} fill="#00C9B1" /> My Dashboard
          </div>

          {!isLoaded ? (
            <Skeleton w={260} h={38} r={10} />
          ) : (
            <h1 style={{
              margin: 0, fontSize: 'clamp(24px,4vw,38px)', fontWeight: 900,
              letterSpacing: '-0.03em', color: '#F0F4FF', lineHeight: 1.1,
            }}>
              Welcome back,{' '}
              <span style={{
                background: 'linear-gradient(90deg, #00C9B1, #38BDF8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {fullName}
              </span>
              {' '}👋
            </h1>
          )}
          <p style={{ margin: '10px 0 0', color: '#8B9DC3', fontSize: 15 }}>
            Here&apos;s a quick overview of your account and everything you can do on JobQuest.
          </p>
        </div>

        {/* ── Profile card ──────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,201,177,0.06) 0%, rgba(15,32,68,0.95) 60%)',
          border: '1px solid rgba(0,201,177,0.18)',
          borderRadius: 20, padding: '32px', marginBottom: 32,
          display: 'flex', alignItems: 'flex-start', gap: 28, flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          {!isLoaded ? (
            <Skeleton w={80} h={80} r={999} />
          ) : user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={fullName}
              width={80}
              height={80}
              style={{ borderRadius: '50%', border: '3px solid rgba(0,201,177,0.4)', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #00C9B1, #38BDF8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: '#0A1628',
              border: '3px solid rgba(0,201,177,0.4)',
              textTransform: 'uppercase',
            }}>
              {initials || <User size={32} color="#0A1628" />}
            </div>
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {!isLoaded ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Skeleton w={200} h={26} />
                <Skeleton w={160} h={18} />
                <Skeleton w={120} h={18} />
              </div>
            ) : (
              <>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF', marginBottom: 6, letterSpacing: '-0.02em' }}>
                  {user?.fullName || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'User'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8B9DC3', fontSize: 14 }}>
                      <Mail size={14} color="#4A6FA5" />
                      <span>{email}</span>
                      {user?.primaryEmailAddress?.verification?.status === 'verified' && (
                        <span style={{
                          padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                          background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)',
                          color: '#4ADE80',
                        }}>Verified</span>
                      )}
                    </div>
                  )}
                  {joinedAt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8B9DC3', fontSize: 14 }}>
                      <Calendar size={14} color="#4A6FA5" />
                      <span>Member since {formatDate(joinedAt)}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Meta pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 10,
              background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.2)',
              color: '#00C9B1', fontSize: 13, fontWeight: 600,
            }}>
              <Briefcase size={13} /> Free Plan
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 10,
              background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)',
              color: '#38BDF8', fontSize: 13, fontWeight: 600,
            }}>
              <MapPin size={13} /> India
            </div>
          </div>
        </div>

        {/* ── Explore section ───────────────────────────────────────── */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={17} color="#A78BFA" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#F0F4FF', letterSpacing: '-0.02em' }}>
                Explore
              </div>
              <div style={{ fontSize: 13, color: '#8B9DC3', marginTop: 1 }}>
                Everything you can do on JobQuest
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            {EXPLORE.map(({ href, icon: Icon, label, desc, color, gradient, border }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: gradient, border: `1.5px solid ${border}`,
                    borderRadius: 16, padding: '24px',
                    transition: 'all 0.22s', cursor: 'pointer', height: '100%',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = color
                    el.style.transform = 'translateY(-3px)'
                    el.style.boxShadow = `0 12px 32px ${color}18`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = border
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${color}15`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <Icon size={20} color={color} />
                  </div>

                  {/* Text */}
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F0F4FF', marginBottom: 6 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: '#8B9DC3', lineHeight: 1.6, marginBottom: 18 }}>
                    {desc}
                  </div>

                  {/* CTA */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    color, fontSize: 13, fontWeight: 700,
                  }}>
                    Go to {label} <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  )
}
