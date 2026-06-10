'use client'

import Link from 'next/link'
import { Briefcase, Mail, MapPin, Shield, FileText } from 'lucide-react'

const EXPLORE_LINKS = [
  { href: '/',         label: 'Home'          },
  { href: '/search',   label: 'Search Jobs'   },
  { href: '/saved',    label: 'Saved Jobs'    },
  { href: '/post-job', label: 'Post a Job'    },
  { href: '/resume',   label: 'Resume Score'  },
]

const COMPANY_LINKS = [
  { href: '/about',   label: 'About Us'   },
  { href: '/contact', label: 'Contact Us' },
  { href: '/blog',    label: 'Blog'       },
]

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy',     icon: Shield   },
  { href: '/terms',   label: 'Terms & Conditions', icon: FileText },
]

const PORTALS = ['LinkedIn', 'Indeed', 'Glassdoor', 'Naukri', 'ZipRecruiter', 'Google Jobs']

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{ display: 'block', fontSize: 14, color: '#8B9DC3', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#00C9B1'}
      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3'}
    >
      {label}
    </Link>
  )
}

function ColHead({ label }: { label: string }) {
  return (
    <h4 style={{ fontSize: 12, fontWeight: 700, color: '#F0F4FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, marginTop: 0 }}>
      {label}
    </h4>
  )
}

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1E3A5F', background: '#0A1628', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px 0' }}>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: '#00C9B1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={16} color="#0A1628" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#F0F4FF' }}>
                Job<span style={{ color: '#00C9B1' }}>Quest</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.65, maxWidth: 220, marginBottom: 18 }}>
              Every Great Career Starts with a Search. Aggregating jobs from 6 top portals across India.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#4A6FA5' }}>
                <Mail size={13} color="#4A6FA5" /> support@jobquest.in
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#4A6FA5' }}>
                <MapPin size={13} color="#4A6FA5" /> Bangalore, India
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <ColHead label="Explore" />
            {EXPLORE_LINKS.map(l => <FooterLink key={l.href} {...l} />)}
          </div>

          {/* Company */}
          <div>
            <ColHead label="Company" />
            {COMPANY_LINKS.map(l => <FooterLink key={l.href} {...l} />)}
          </div>

          {/* Legal */}
          <div>
            <ColHead label="Legal" />
            {LEGAL_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, color: '#8B9DC3', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#00C9B1'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3'}
              >
                <Icon size={13} />
                {label}
              </Link>
            ))}
          </div>

          {/* Portals */}
          <div>
            <ColHead label="Portals" />
            {PORTALS.map(p => (
              <div key={p} style={{ fontSize: 14, color: '#8B9DC3', marginBottom: 8 }}>{p}</div>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1E3A5F', padding: '20px 0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <p style={{ fontSize: 13, color: '#4A6FA5', margin: 0 }}>
            © {new Date().getFullYear()} JobQuest India — Real jobs from real portals, in one place.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ fontSize: 13, color: '#4A6FA5', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#4A6FA5'}
            >
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ fontSize: 13, color: '#4A6FA5', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#4A6FA5'}
            >
              Terms &amp; Conditions
            </Link>
            <Link href="/contact" style={{ fontSize: 13, color: '#4A6FA5', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#4A6FA5'}
            >
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
