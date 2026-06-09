'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Briefcase, Search, Bookmark, Sparkles, Crown,
  FileText, Home, PlusCircle, ChevronDown, LayoutDashboard,
} from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs'

/* ══════════════════════════════════════════════════════
   PLAN BADGE
══════════════════════════════════════════════════════ */
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
        <Sparkles size={13} />Upgrade
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
      <Crown size={13} />{plan}
    </Link>
  )
}

/* ══════════════════════════════════════════════════════
   SIMPLE NAV LINK
══════════════════════════════════════════════════════ */
function NavLink({ href, icon: Icon, label, active }: {
  href: string; icon: React.ElementType; label: string; active: boolean
}) {
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
      <Icon size={15} /><span>{label}</span>
    </Link>
  )
}

/* ══════════════════════════════════════════════════════
   EXPLORE DROPDOWN
══════════════════════════════════════════════════════ */
const EXPLORE_ITEMS = [
  { href: '/search',   icon: Search,     label: 'Search Jobs',  desc: 'Find jobs across 6 portals',      color: '#00C9B1' },
  { href: '/saved',    icon: Bookmark,   label: 'Saved Jobs',   desc: 'Your bookmarked listings',        color: '#38BDF8' },
  { href: '/post-job', icon: PlusCircle, label: 'Post a Job',   desc: 'Hire from thousands of seekers',  color: '#A78BFA' },
]

function ExploreDropdown({ path }: { path: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const active = ['/search', '/saved', '/post-job', '/resume'].includes(path)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.18s',
        background: active ? 'rgba(0,201,177,0.1)' : 'transparent',
        color: active ? '#00C9B1' : '#8B9DC3',
        border: active ? '1px solid rgba(0,201,177,0.2)' : '1px solid transparent',
      }}>
        <FileText size={15} />
        <span>Explore</span>
        <ChevronDown size={13} style={{ marginLeft: 2, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div style={panelStyle(260)}>
          <DropItem href="/resume" icon={FileText} label="Resume Score" desc="AI-powered ATS analysis" color="#00C9B1"
            active={path === '/resume'} onClick={() => setOpen(false)} divider />
          {EXPLORE_ITEMS.map(item => (
            <DropItem key={item.href} {...item} active={path === item.href} onClick={() => setOpen(false)} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── shared dropdown item ────────────────────────────────────────────────── */
function DropItem({ href, icon: Icon, label, desc, color, active, onClick, divider }: {
  href: string; icon: React.ElementType; label: string; desc: string
  color: string; active: boolean; onClick: () => void; divider?: boolean
}) {
  return (
    <Link href={href} onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 18px', textDecoration: 'none',
      borderBottom: divider ? '1px solid #1E3A5F' : 'none',
      background: active ? `${color}0D` : 'transparent', transition: 'background 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = `${color}12`)}
      onMouseLeave={e => (e.currentTarget.style.background = active ? `${color}0D` : 'transparent')}
    >
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: active ? color : '#F0F4FF' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#4A6FA5', marginTop: 1 }}>{desc}</div>
      </div>
    </Link>
  )
}

/* ── shared panel style ──────────────────────────────────────────────────── */
function panelStyle(minW: number): React.CSSProperties {
  return {
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    minWidth: minW, borderRadius: 16,
    background: 'rgba(10,22,40,0.97)', border: '1px solid #1E3A5F',
    boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,201,177,0.06)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    overflow: 'hidden', zIndex: 200, animation: 'dropIn 0.18s ease',
  }
}

/* ══════════════════════════════════════════════════════
   NAVBAR ROOT
══════════════════════════════════════════════════════ */
export function Navbar() {
  const path = usePathname()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,22,40,0.85)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1E3A5F',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: '#00C9B1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(0,201,177,0.4)',
          }}>
            <Briefcase size={17} color="#0A1628" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#F0F4FF', letterSpacing: '-0.02em' }}>
            Job<span style={{ color: '#00C9B1' }}>Quest</span>
          </span>
        </Link>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <NavLink href="/" icon={Home} label="Home" active={path === '/'} />
          <ExploreDropdown path={path} />
          <PlanBadge />

          {/* Clerk auth controls */}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button style={{
                padding: '7px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', border: '1px solid #1E3A5F',
                background: 'transparent', color: '#8B9DC3', transition: 'all 0.18s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#F0F4FF'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#4A6FA5' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#8B9DC3'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E3A5F' }}
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button style={{
                padding: '7px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', border: '1px solid rgba(0,201,177,0.4)',
                background: 'rgba(0,201,177,0.1)', color: '#00C9B1', transition: 'all 0.18s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,201,177,0.18)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,201,177,0.1)' }}
              >
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" active={path === '/dashboard'} />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 34, height: 34 },
                },
              }}
            />
          </Show>
        </div>
      </div>

      <style>{`
        @keyframes dropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform: rotate(360deg); } }
      `}</style>
    </nav>
  )
}
