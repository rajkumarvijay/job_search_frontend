'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Briefcase, Search, Bookmark, Sparkles, Crown,
  FileText, Home, PlusCircle, ChevronDown,
} from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'

/* ── Plan badge ─────────────────────────────────────────────────────────── */
function PlanBadge() {
  const { data: sub } = useSubscription()
  const plan = sub?.plan_code ?? 'free'

  if (plan === 'free') {
    return (
      <Link href="/pricing" style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 999, textDecoration: 'none',
        background: 'rgba(0,201,177,0.1)', border: '1px solid rgba(0,201,177,0.3)',
        color: '#00C9B1', fontSize: 13, fontWeight: 700,
      }}>
        <Sparkles size={13} />
        Upgrade
      </Link>
    )
  }

  const isEnterprise = plan === 'enterprise'
  return (
    <Link href="/pricing" style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 999, textDecoration: 'none',
      background: isEnterprise ? 'rgba(192,132,252,0.12)' : 'rgba(56,189,248,0.12)',
      border: `1px solid ${isEnterprise ? 'rgba(192,132,252,0.4)' : 'rgba(56,189,248,0.4)'}`,
      color: isEnterprise ? '#C084FC' : '#38BDF8', fontSize: 13, fontWeight: 700,
      textTransform: 'capitalize',
    }}>
      <Crown size={13} />
      {plan}
    </Link>
  )
}

/* ── Simple nav link ────────────────────────────────────────────────────── */
function NavLink({
  href, icon: Icon, label, active,
}: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 14px', borderRadius: 10,
      fontSize: 14, fontWeight: 500, textDecoration: 'none',
      background: active ? 'rgba(0,201,177,0.1)' : 'transparent',
      color: active ? '#00C9B1' : '#8B9DC3',
      border: active ? '1px solid rgba(0,201,177,0.2)' : '1px solid transparent',
      transition: 'all 0.18s',
    }}>
      <Icon size={15} />
      <span>{label}</span>
    </Link>
  )
}

/* ── Resume Score dropdown ──────────────────────────────────────────────── */
const DROPDOWN_ITEMS = [
  {
    href: '/search',
    icon: Search,
    label: 'Search Jobs',
    desc: 'Find jobs across 6 portals',
    color: '#00C9B1',
  },
  {
    href: '/saved',
    icon: Bookmark,
    label: 'Saved Jobs',
    desc: 'Your bookmarked listings',
    color: '#38BDF8',
  },
  {
    href: '/post-job',
    icon: PlusCircle,
    label: 'Post a Job',
    desc: 'Hire from thousands of seekers',
    color: '#A78BFA',
  },
]

function ResumeDropdown({ path }: { path: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const dropdownActive = ['/search', '/saved', '/post-job', '/resume'].includes(path)

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 10,
          fontSize: 14, fontWeight: 500, cursor: 'pointer',
          background: dropdownActive ? 'rgba(0,201,177,0.1)' : 'transparent',
          color: dropdownActive ? '#00C9B1' : '#8B9DC3',
          border: dropdownActive ? '1px solid rgba(0,201,177,0.2)' : '1px solid transparent',
          transition: 'all 0.18s',
        }}
      >
        <FileText size={15} />
        <span>Resume Score</span>
        <ChevronDown
          size={13}
          style={{
            marginLeft: 2,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          minWidth: 260, borderRadius: 16,
          background: 'rgba(10,22,40,0.97)',
          border: '1px solid #1E3A5F',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,201,177,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          overflow: 'hidden',
          zIndex: 200,
          animation: 'dropIn 0.18s ease',
        }}>
          {/* Resume Score itself — top item */}
          <Link
            href="/resume"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 18px', textDecoration: 'none',
              borderBottom: '1px solid #1E3A5F',
              background: path === '/resume' ? 'rgba(0,201,177,0.06)' : 'transparent',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,201,177,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = path === '/resume' ? 'rgba(0,201,177,0.06)' : 'transparent')}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: 'rgba(0,201,177,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={16} color="#00C9B1" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: path === '/resume' ? '#00C9B1' : '#F0F4FF' }}>
                Resume Score
              </div>
              <div style={{ fontSize: 12, color: '#4A6FA5', marginTop: 1 }}>
                AI-powered ATS analysis
              </div>
            </div>
          </Link>

          {/* Other items */}
          {DROPDOWN_ITEMS.map(({ href, icon: Icon, label, desc, color }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 18px', textDecoration: 'none',
                  background: active ? `${color}0D` : 'transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = `${color}12`)}
                onMouseLeave={e => (e.currentTarget.style.background = active ? `${color}0D` : 'transparent')}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: `${color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: active ? color : '#F0F4FF' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 12, color: '#4A6FA5', marginTop: 1 }}>{desc}</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Navbar ─────────────────────────────────────────────────────────────── */
const S = {
  nav: {
    position: 'sticky' as const, top: 0, zIndex: 50,
    background: 'rgba(10,22,40,0.85)',
    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid #1E3A5F',
  } as React.CSSProperties,
  inner: {
    maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoIcon: {
    width: 34, height: 34, borderRadius: 10, background: '#00C9B1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 14px rgba(0,201,177,0.4)',
  },
  logoText: { fontWeight: 800, fontSize: 20, color: '#F0F4FF', letterSpacing: '-0.02em' },
  links: { display: 'flex', alignItems: 'center', gap: 4 },
}

export function Navbar() {
  const path = usePathname()
  return (
    <nav style={S.nav}>
      <div style={S.inner}>
        {/* Logo */}
        <Link href="/" style={S.logo}>
          <div style={S.logoIcon}>
            <Briefcase size={17} color="#0A1628" strokeWidth={2.5} />
          </div>
          <span style={S.logoText}>
            Job<span style={{ color: '#00C9B1' }}>Quest</span>
          </span>
        </Link>

        {/* Links */}
        <div style={S.links}>
          <NavLink href="/" icon={Home} label="Home" active={path === '/'} />
          <ResumeDropdown path={path} />
          <PlanBadge />
        </div>
      </div>

      {/* Dropdown animation */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}
