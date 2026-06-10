'use client'

import Link from 'next/link'
import { Briefcase } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1E3A5F', background: '#0A1628', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: '#00C9B1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={16} color="#0A1628" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#F0F4FF' }}>
                Job<span style={{ color: '#00C9B1' }}>Quest</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.65, maxWidth: 220 }}>
              Every Great Career Starts with a Search. Aggregating jobs from 6 top portals across India.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#F0F4FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Explore</h4>
            {[['/', 'Home'], ['/search', 'Search Jobs'], ['/saved', 'Saved Jobs']].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: 14, color: '#8B9DC3', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#00C9B1'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3'}
              >
                {label}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#F0F4FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Company</h4>
            {[['/about', 'About Us'], ['/contact', 'Contact Us']].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: 14, color: '#8B9DC3', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#00C9B1'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#8B9DC3'}
              >
                {label}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#F0F4FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Portals</h4>
            {['LinkedIn', 'Indeed', 'Glassdoor', 'Naukri', 'ZipRecruiter', 'Google Jobs'].map(p => (
              <div key={p} style={{ fontSize: 14, color: '#8B9DC3', marginBottom: 8 }}>{p}</div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1E3A5F', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 13, color: '#8B9DC3' }}>
            © {new Date().getFullYear()} JobQuest India — Real jobs from real portals, in one place.
          </p>
        </div>
      </div>
    </footer>
  )
}
