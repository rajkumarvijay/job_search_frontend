'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Briefcase, Search, Bookmark, Sparkles, Crown } from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'

function PlanBadge() {
  const { data: sub } = useSubscription()
  const plan = sub?.plan_code ?? 'free'

  if (plan === 'free') {
    return (
      <Link
        href="/pricing"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 999, textDecoration: 'none',
          background: 'rgba(0,201,177,0.1)', border: '1px solid rgba(0,201,177,0.3)',
          color: '#00C9B1', fontSize: 13, fontWeight: 700,
        }}
      >
        <Sparkles size={13} />
        Upgrade
      </Link>
    )
  }

  const isEnterprise = plan === 'enterprise'
  return (
    <Link
      href="/pricing"
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 999, textDecoration: 'none',
        background: isEnterprise ? 'rgba(192,132,252,0.12)' : 'rgba(56,189,248,0.12)',
        border: `1px solid ${isEnterprise ? 'rgba(192,132,252,0.4)' : 'rgba(56,189,248,0.4)'}`,
        color: isEnterprise ? '#C084FC' : '#38BDF8', fontSize: 13, fontWeight: 700,
        textTransform: 'capitalize',
      }}
    >
      <Crown size={13} />
      {plan}
    </Link>
  )
}

const S = {
  nav: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    background: 'rgba(10,22,40,0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid #1E3A5F',
  } as React.CSSProperties,
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: '#00C9B1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 14px rgba(0,201,177,0.4)',
  },
  logoText: {
    fontWeight: 800,
    fontSize: 20,
    color: '#F0F4FF',
    letterSpacing: '-0.02em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
}

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
        background: active ? 'rgba(0,201,177,0.1)' : 'transparent',
        color: active ? '#00C9B1' : '#8B9DC3',
        border: active ? '1px solid rgba(0,201,177,0.2)' : '1px solid transparent',
        transition: 'all 0.18s',
      }}
    >
      <Icon size={15} />
      <span>{label}</span>
    </Link>
  )
}

export function Navbar() {
  const path = usePathname()
  return (
    <nav style={S.nav}>
      <div style={S.inner}>
        <Link href="/" style={S.logo}>
          <div style={S.logoIcon}>
            <Briefcase size={17} color="#0A1628" strokeWidth={2.5} />
          </div>
          <span style={S.logoText}>
            Job<span style={{ color: '#00C9B1' }}>Quest</span>
          </span>
        </Link>
        <div style={S.links}>
          <NavLink href="/search" icon={Search} label="Search Jobs" active={path === '/search'} />
          <NavLink href="/saved" icon={Bookmark} label="Saved" active={path === '/saved'} />
          <PlanBadge />
        </div>
      </div>
    </nav>
  )
}
