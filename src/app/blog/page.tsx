'use client'

import Link from 'next/link'
import { BookOpen, ArrowRight, Clock, Tag } from 'lucide-react'

const POSTS = [
  {
    slug: '#',
    tag: 'Resume Tips',
    tagColor: '#00C9B1',
    title: 'How to Write an ATS-Friendly Resume in 2026',
    excerpt: 'Most resumes never reach a human recruiter — they are filtered out by ATS software. Learn the exact formatting rules, keyword strategies, and section order that gets your resume past the bots.',
    readTime: '6 min read',
    date: 'June 5, 2026',
  },
  {
    slug: '#',
    tag: 'Interview Prep',
    tagColor: '#38BDF8',
    title: '10 Behavioral Interview Questions Every Developer Gets Asked',
    excerpt: 'STAR method, system design, and the culture-fit round — here is how top engineers at Razorpay, Flipkart, and Google India structure their answers to land the offer.',
    readTime: '8 min read',
    date: 'May 28, 2026',
  },
  {
    slug: '#',
    tag: 'Job Search',
    tagColor: '#A78BFA',
    title: 'LinkedIn vs Naukri vs Indeed: Which Portal Gets You Hired Faster in India?',
    excerpt: 'We analysed thousands of job applications across 6 portals to find which ones yield the fastest response rates by role, city, and experience level.',
    readTime: '5 min read',
    date: 'May 20, 2026',
  },
  {
    slug: '#',
    tag: 'Salary',
    tagColor: '#FBBF24',
    title: 'Average Tech Salaries in Bangalore, Hyderabad & Pune — 2026 Report',
    excerpt: 'From fresher to senior engineer, data scientist to product manager — a comprehensive breakdown of what Indian tech professionals are actually earning this year.',
    readTime: '7 min read',
    date: 'May 12, 2026',
  },
  {
    slug: '#',
    tag: 'Career Growth',
    tagColor: '#4ADE80',
    title: 'How to Switch from Service-Based to Product-Based Companies',
    excerpt: 'The gap feels huge but the path is clear. Here is a proven roadmap — skills to build, projects to show, and the exact questions product companies ask that service companies do not.',
    readTime: '9 min read',
    date: 'May 4, 2026',
  },
  {
    slug: '#',
    tag: 'Resume Tips',
    tagColor: '#00C9B1',
    title: 'The One-Page Resume Rule: Myth or Must?',
    excerpt: 'Hiring managers across India weigh in. We surveyed 200 recruiters at top Indian startups and enterprises to settle the one-page debate once and for all.',
    readTime: '4 min read',
    date: 'April 25, 2026',
  },
]

const CATEGORIES = ['All', 'Resume Tips', 'Interview Prep', 'Job Search', 'Salary', 'Career Growth']

export default function BlogPage() {
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: '56px 24px 100px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.22)',
            color: '#00C9B1', fontSize: 13, fontWeight: 600,
          }}>
            <BookOpen size={13} /> Career Resources
          </div>
          <h1 style={{
            fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900,
            letterSpacing: '-0.035em', color: '#F0F4FF', lineHeight: 1.1, marginBottom: 16,
          }}>
            JobQuest <span style={{ background: 'linear-gradient(90deg,#00C9B1,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Blog</span>
          </h1>
          <p style={{ fontSize: 17, color: '#8B9DC3', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Resume tips, interview guides, salary data, and job search strategies for Indian professionals.
          </p>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52 }}>
          {CATEGORIES.map((cat, i) => (
            <div key={cat} style={{
              padding: '7px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              background: i === 0 ? 'rgba(0,201,177,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === 0 ? 'rgba(0,201,177,0.4)' : '#1E3A5F'}`,
              color: i === 0 ? '#00C9B1' : '#8B9DC3',
              cursor: 'pointer',
            }}>
              {cat}
            </div>
          ))}
        </div>

        {/* Posts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 24 }}>
          {POSTS.map(({ slug, tag, tagColor, title, excerpt, readTime, date }) => (
            <Link key={title} href={slug} style={{ textDecoration: 'none' }}>
              <article style={{
                background: '#0F2044', border: '1px solid #1E3A5F',
                borderRadius: 20, overflow: 'hidden', height: '100%',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.22s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = `${tagColor}55`
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = `0 12px 40px ${tagColor}10`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = '#1E3A5F'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Color band */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${tagColor}, ${tagColor}44)` }} />

                <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  {/* Tag */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 12px', borderRadius: 999, alignSelf: 'flex-start',
                    background: `${tagColor}12`, border: `1px solid ${tagColor}30`,
                    fontSize: 11, fontWeight: 700, color: tagColor, textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    <Tag size={10} /> {tag}
                  </div>

                  {/* Title */}
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: '#F0F4FF', lineHeight: 1.4, margin: 0 }}>
                    {title}
                  </h2>

                  {/* Excerpt */}
                  <p style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.7, margin: 0, flex: 1 }}>
                    {excerpt}
                  </p>

                  {/* Meta + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #1E3A5F', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#4A6FA5' }}>
                        <Clock size={11} /> {readTime}
                      </span>
                      <span style={{ fontSize: 12, color: '#4A6FA5' }}>{date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: tagColor, fontWeight: 700 }}>
                      Read <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Coming soon notice */}
        <div style={{
          marginTop: 64, padding: '28px 32px', borderRadius: 16,
          background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 14, color: '#8B9DC3', margin: 0 }}>
            More articles coming soon. Have a topic you&apos;d like us to cover?{' '}
            <Link href="/contact" style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 600 }}>
              Let us know →
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
