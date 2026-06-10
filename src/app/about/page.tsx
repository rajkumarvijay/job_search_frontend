import Link from 'next/link'
import {
  Briefcase, Search, Bookmark, FileText, PlusCircle,
  Users, Globe, TrendingUp, Shield, Zap, Heart,
  CheckCircle2, ArrowRight, Star, Target, Lightbulb, Code2,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — JobQuest India',
  description: 'Learn about JobQuest India — our mission to simplify job search by aggregating listings from LinkedIn, Indeed, Naukri, Glassdoor, and more in one place.',
}

/* ---------------------------------------------------------------------------
   Data
--------------------------------------------------------------------------- */
const STATS = [
  { value: '485K+',  label: 'Active Job Seekers',  color: '#00C9B1' },
  { value: '1.2M+',  label: 'Jobs Aggregated',     color: '#38BDF8' },
  { value: '6',      label: 'Portals Connected',   color: '#A78BFA' },
  { value: '45+',    label: 'Cities Covered',      color: '#FBBF24' },
]

const VALUES = [
  {
    icon: Shield,
    color: '#00C9B1',
    title: 'Transparency',
    body: 'Every job listing links back to its original source. We never hide where a job came from or add hidden layers between you and the employer.',
  },
  {
    icon: Zap,
    color: '#38BDF8',
    title: 'Speed',
    body: 'Real-time aggregation means you see fresh listings the moment they go live — no stale data, no 48-hour delays.',
  },
  {
    icon: Heart,
    color: '#F87171',
    title: 'Candidate First',
    body: 'No pay-to-rank listings, no promoted noise at the top. Search results are sorted by relevance, always.',
  },
  {
    icon: Lightbulb,
    color: '#FBBF24',
    title: 'AI-Powered',
    body: 'From resume scoring to job-match recommendations, we use Gemini AI to give every candidate an unfair advantage.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    color: '#00C9B1',
    title: 'Search Once',
    body: 'Type a role or skill and hit search. We query LinkedIn, Indeed, Naukri, Glassdoor, ZipRecruiter, and Google Jobs simultaneously.',
  },
  {
    step: '02',
    icon: Target,
    color: '#38BDF8',
    title: 'Filter & Focus',
    body: 'Narrow down by location, salary range, work mode, experience level, and platform — all in one sidebar.',
  },
  {
    step: '03',
    icon: Bookmark,
    color: '#A78BFA',
    title: 'Save & Track',
    body: 'Bookmark jobs, upload your resume for an ATS score, and track every application from your personal dashboard.',
  },
]

const PORTALS = [
  { name: 'LinkedIn',       color: '#0A66C2', jobs: '400K+' },
  { name: 'Indeed',         color: '#2557A7', jobs: '320K+' },
  { name: 'Naukri',         color: '#FF7555', jobs: '280K+' },
  { name: 'Glassdoor',      color: '#0CAA41', jobs: '150K+' },
  { name: 'ZipRecruiter',   color: '#5B39A8', jobs: '90K+' },
  { name: 'Google Jobs',    color: '#EA4335', jobs: '200K+' },
]

const TEAM_VALUES = [
  'We believe no one should miss their dream job because it was buried on a portal they forgot to check.',
  'We believe career tools should be free, fast, and actually useful — not paywalled behind enterprise tiers.',
  'We believe AI should amplify human potential, not replace the human in the loop.',
]

/* ---------------------------------------------------------------------------
   Component
--------------------------------------------------------------------------- */
export default function AboutPage() {
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>

      {/* ===== HERO ===== */}
      <section style={{ padding: '80px 24px 72px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 18px', borderRadius: 999, marginBottom: 24,
            background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)',
            color: '#00C9B1', fontSize: 13, fontWeight: 600,
          }}>
            <Briefcase size={13} /> Our Story
          </div>

          <h1 style={{
            fontSize: 'clamp(32px,6vw,58px)', fontWeight: 900,
            letterSpacing: '-0.035em', color: '#F0F4FF', lineHeight: 1.05, marginBottom: 22,
          }}>
            Every Great Career{' '}
            <span style={{
              background: 'linear-gradient(90deg,#00C9B1,#38BDF8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Starts with a Search
            </span>
          </h1>

          <p style={{ fontSize: 18, color: '#8B9DC3', lineHeight: 1.75, marginBottom: 36 }}>
            JobQuest was built with one frustration in mind — why should job seekers
            log into six different portals every morning to find the same role posted six times?
            We aggregate, you focus.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 14, textDecoration: 'none',
              background: 'linear-gradient(135deg,#00C9B1,#0EA5E9)',
              color: '#0A1628', fontWeight: 800, fontSize: 15,
            }}>
              Search Jobs <ArrowRight size={16} />
            </Link>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 14, textDecoration: 'none',
              background: 'rgba(255,255,255,0.04)', border: '1.5px solid #1E3A5F',
              color: '#F0F4FF', fontWeight: 700, fontSize: 15,
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
            {STATS.map(({ value, label, color }) => (
              <div key={label} style={{
                background: '#0F2044', border: `1px solid ${color}25`,
                borderRadius: 20, padding: '28px 24px', textAlign: 'center',
                transition: 'transform 0.2s, border-color 0.2s',
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color, letterSpacing: '-0.03em', marginBottom: 6 }}>{value}</div>
                <div style={{ fontSize: 13, color: '#8B9DC3', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR MISSION ===== */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 24, alignItems: 'center' }}>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#00C9B1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Our Mission</div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: '#F0F4FF', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 20 }}>
                One search.<br />Six portals.<br />Zero missed opportunities.
              </h2>
              <p style={{ fontSize: 15, color: '#8B9DC3', lineHeight: 1.75, marginBottom: 20 }}>
                India has millions of job seekers and thousands of portals. The result? Fragmented, duplicate, outdated listings that waste hours of your day.
              </p>
              <p style={{ fontSize: 15, color: '#8B9DC3', lineHeight: 1.75, marginBottom: 28 }}>
                JobQuest connects directly to the APIs and feeds of LinkedIn, Indeed, Naukri, Glassdoor, ZipRecruiter, and Google Jobs — normalising, deduplicating, and surfacing the freshest listings in a single, clean interface.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Real-time aggregation, not cached day-old data',
                  'AI-powered ATS resume scoring with Gemini',
                  'Free job posting for employers and individuals',
                  'Personal dashboard with application tracking',
                ].map(pt => (
                  <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={16} color="#00C9B1" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: '#A8C0E0' }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Portal cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {PORTALS.map(({ name, color, jobs }) => (
                <div key={name} style={{
                  background: '#0F2044', border: `1px solid ${color}25`,
                  borderRadius: 16, padding: '20px', transition: 'all 0.2s',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Globe size={17} color={color} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F0F4FF', marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 12, color: '#8B9DC3' }}>{jobs} jobs</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '72px 24px', background: 'rgba(14,30,58,0.6)', borderTop: '1px solid #1E3A5F', borderBottom: '1px solid #1E3A5F' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 900, color: '#F0F4FF', letterSpacing: '-0.03em', margin: 0 }}>
              From search to offer in three steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {HOW_IT_WORKS.map(({ step, icon: Icon, color, title, body }) => (
              <div key={step} style={{
                background: '#0F2044', border: `1px solid ${color}25`,
                borderRadius: 20, padding: '32px 28px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 48, fontWeight: 900, color: `${color}12`, lineHeight: 1 }}>{step}</div>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#F0F4FF', marginBottom: 12, letterSpacing: '-0.02em' }}>{title}</div>
                <div style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.7 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>What We Stand For</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 900, color: '#F0F4FF', letterSpacing: '-0.03em', margin: 0 }}>Our Core Values</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
            {VALUES.map(({ icon: Icon, color, title, body }) => (
              <div key={title} style={{
                background: `linear-gradient(135deg,${color}08 0%,rgba(15,32,68,0.9) 100%)`,
                border: `1px solid ${color}22`, borderRadius: 20, padding: '28px 24px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#F0F4FF', marginBottom: 10, letterSpacing: '-0.02em' }}>{title}</div>
                <div style={{ fontSize: 13, color: '#8B9DC3', lineHeight: 1.7 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BUILT WITH ===== */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg,rgba(0,201,177,0.06) 0%,rgba(56,189,248,0.04) 100%)',
            border: '1px solid rgba(0,201,177,0.2)', borderRadius: 24, padding: '48px 40px',
            textAlign: 'center',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(0,201,177,0.12)', border: '1px solid rgba(0,201,177,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Code2 size={26} color="#00C9B1" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 900, color: '#F0F4FF', marginBottom: 16, letterSpacing: '-0.03em' }}>
              Built for Job Seekers, by Job Seekers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {TEAM_VALUES.map((v, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left' }}>
                  <Star size={15} color="#00C9B1" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: '#A8C0E0', lineHeight: 1.65 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
              {['Next.js 16', 'FastAPI', 'Gemini AI', 'Clerk Auth', 'PostgreSQL'].map(tech => (
                <span key={tech} style={{
                  padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #1E3A5F', color: '#8B9DC3',
                }}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 900, color: '#F0F4FF', letterSpacing: '-0.03em', marginBottom: 14 }}>
            Ready to find your next role?
          </h2>
          <p style={{ fontSize: 15, color: '#8B9DC3', marginBottom: 32, lineHeight: 1.7 }}>
            Join hundreds of thousands of job seekers who search smarter with JobQuest every day.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, textDecoration: 'none', background: 'linear-gradient(135deg,#00C9B1,#0EA5E9)', color: '#0A1628', fontWeight: 800, fontSize: 15 }}>
              Start Searching <ArrowRight size={16} />
            </Link>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 14, textDecoration: 'none', background: 'transparent', border: '1.5px solid #1E3A5F', color: '#F0F4FF', fontWeight: 700, fontSize: 15 }}>
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
