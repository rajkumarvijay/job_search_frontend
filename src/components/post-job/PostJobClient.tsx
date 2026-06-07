'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  Briefcase, Building2, MapPin, DollarSign,
  FileText, Mail, Link2, CheckCircle2, AlertCircle,
  ChevronRight, Sparkles, Users, Globe,
} from 'lucide-react'
import { postJobApi } from '@/lib/api'
import { INDIA_CITIES } from '@/lib/constants'

/* ── Helpers ─────────────────────────────────────────────────────────────── */
type Stage = 'form' | 'submitting' | 'success'

interface FormData {
  title: string
  company: string
  location: string
  customLocation: string
  job_type: string
  work_mode: string
  experience: string
  min_salary: string
  max_salary: string
  salary_currency: string
  description: string
  skills: string
  contact_email: string
  apply_url: string
  company_url: string
}

const EMPTY: FormData = {
  title: '', company: '', location: 'India', customLocation: '',
  job_type: 'Full-time', work_mode: 'On-site', experience: 'Any',
  min_salary: '', max_salary: '', salary_currency: 'INR',
  description: '', skills: '', contact_email: '',
  apply_url: '', company_url: '',
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const card: React.CSSProperties = {
  background: '#0F2044',
  border: '1px solid #1E3A5F',
  borderRadius: 16,
  padding: '32px',
  marginBottom: 24,
}

const label: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: '#8B9DC3', marginBottom: 8, letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#0A1628', border: '1.5px solid #1E3A5F',
  borderRadius: 10, padding: '12px 16px',
  color: '#F0F4FF', fontSize: 15, outline: 'none',
  transition: 'border-color 0.2s',
}

const sectionTitle = (icon: React.ReactNode, text: string) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: 'rgba(0,201,177,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </div>
    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#F0F4FF' }}>{text}</h2>
  </div>
)

const pillButtons = (
  options: string[],
  value: string,
  onChange: (v: string) => void,
  colorMap?: Record<string, string>,
) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    {options.map(opt => {
      const active = value === opt
      const color = colorMap?.[opt] ?? '#00C9B1'
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          style={{
            padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.18s',
            border: `1.5px solid ${active ? color : '#1E3A5F'}`,
            background: active ? `${color}18` : 'transparent',
            color: active ? color : '#8B9DC3',
          }}
        >
          {opt}
        </button>
      )
    })}
  </div>
)

/* ── Main Component ──────────────────────────────────────────────────────── */
export function PostJobClient() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(EMPTY)
  const [stage, setStage] = useState<Stage>('form')
  const [error, setError] = useState('')
  const [postedId, setPostedId] = useState('')
  const [focusedField, setFocusedField] = useState('')

  const set = (key: keyof FormData) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }))
  )
  const setVal = (key: keyof FormData) => (v: string) => setForm(p => ({ ...p, [key]: v }))

  const focused = (field: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === field ? '#00C9B1' : '#1E3A5F',
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    // Validation
    if (!form.title.trim()) return setError('Job title is required.')
    if (!form.company.trim()) return setError('Company name is required.')
    if (!form.contact_email.trim()) return setError('Contact email is required.')
    if (form.description.trim().length < 80) return setError('Please write at least 80 characters in the description.')

    setStage('submitting')
    try {
      const payload = {
        title:           form.title.trim(),
        company:         form.company.trim(),
        location:        form.customLocation.trim() || form.location,
        job_type:        form.job_type,
        work_mode:       form.work_mode,
        experience:      form.experience,
        min_salary:      form.min_salary ? Number(form.min_salary) : undefined,
        max_salary:      form.max_salary ? Number(form.max_salary) : undefined,
        salary_currency: form.salary_currency,
        description:     form.description.trim(),
        skills:          form.skills.trim() || undefined,
        contact_email:   form.contact_email.trim(),
        apply_url:       form.apply_url.trim() || undefined,
        company_url:     form.company_url.trim() || undefined,
      }
      const { data } = await postJobApi.submit(payload)
      setPostedId(data.job_id ?? '')
      setStage('success')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? 'Something went wrong. Please try again.'
      setError(msg)
      setStage('form')
    }
  }

  /* ── Success screen ─────────────────────────────────────────────────────── */
  if (stage === 'success') {
    return (
      <div style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 24px', background: '#0A1628',
      }}>
        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(0,201,177,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 0 32px rgba(0,201,177,0.2)',
          }}>
            <CheckCircle2 size={40} color="#00C9B1" />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#F0F4FF', marginBottom: 12 }}>
            Job Posted!
          </h1>
          <p style={{ color: '#8B9DC3', fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>
            Your listing is now live on <strong style={{ color: '#00C9B1' }}>JobQuest</strong> and will appear in relevant search results.
          </p>
          {postedId && (
            <p style={{ color: '#4A6FA5', fontSize: 12, marginBottom: 32 }}>
              Job ID: <code style={{ color: '#8B9DC3' }}>{postedId}</code>
            </p>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setForm(EMPTY); setPostedId(''); setStage('form') }}
              style={{
                padding: '12px 24px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                background: 'rgba(0,201,177,0.1)', border: '1.5px solid rgba(0,201,177,0.3)',
                color: '#00C9B1', cursor: 'pointer',
              }}
            >
              Post Another Job
            </button>
            <button
              onClick={() => router.push('/search?q=' + encodeURIComponent(form.title))}
              style={{
                padding: '12px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: 'linear-gradient(135deg, #00C9B1 0%, #0EA5E9 100%)',
                border: 'none', color: '#0A1628', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              View in Search <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Form ───────────────────────────────────────────────────────────────── */
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 18px', borderRadius: 999,
            background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)',
            color: '#00C9B1', fontSize: 13, fontWeight: 600, marginBottom: 20,
          }}>
            <Sparkles size={13} fill="#00C9B1" />
            Free Job Posting · No Account Needed
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-0.03em', color: '#F0F4FF', marginBottom: 12,
          }}>
            Post a Job on <span style={{
              background: 'linear-gradient(90deg, #00C9B1, #38BDF8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>JobQuest</span>
          </h1>
          <p style={{ color: '#8B9DC3', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Reach thousands of active job seekers across India — completely free.
          </p>

          {/* Stats strip */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 40, marginTop: 28, flexWrap: 'wrap',
          }}>
            {[
              { icon: <Users size={14} color="#00C9B1" />, text: '485K+ Job Seekers' },
              { icon: <Globe size={14} color="#38BDF8" />, text: '45+ Cities' },
              { icon: <Briefcase size={14} color="#A78BFA" />, text: '6 Portals · 1 Post' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B9DC3', fontSize: 13 }}>
                {icon} {text}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Section 1: Basic Info ───────────────────────────────────────── */}
          <div style={card}>
            {sectionTitle(<Briefcase size={18} color="#00C9B1" />, 'Basic Information')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={label}>Job Title *</label>
                <input
                  value={form.title} onChange={set('title')} required
                  placeholder="e.g. Senior React Developer"
                  style={focused('title')}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
              <div>
                <label style={label}>Company Name *</label>
                <input
                  value={form.company} onChange={set('company')} required
                  placeholder="e.g. Acme Technologies"
                  style={focused('company')}
                  onFocus={() => setFocusedField('company')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
              <div>
                <label style={label}>Company Website</label>
                <input
                  value={form.company_url} onChange={set('company_url')} type="url"
                  placeholder="https://yourcompany.com"
                  style={focused('company_url')}
                  onFocus={() => setFocusedField('company_url')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Location & Type ─────────────────────────────────── */}
          <div style={card}>
            {sectionTitle(<MapPin size={18} color="#38BDF8" />, 'Location & Job Type')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <label style={label}>City / Location</label>
                <select
                  value={form.location} onChange={set('location')}
                  style={{ ...focused('location'), cursor: 'pointer' }}
                  onFocus={() => setFocusedField('location')}
                  onBlur={() => setFocusedField('')}
                >
                  {INDIA_CITIES.map(c => (
                    <option key={c} value={c} style={{ background: '#0A1628' }}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={label}>Custom Location (optional)</label>
                <input
                  value={form.customLocation} onChange={set('customLocation')}
                  placeholder="e.g. Whitefield, Bangalore"
                  style={focused('customLocation')}
                  onFocus={() => setFocusedField('customLocation')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={label}>Job Type</label>
              {pillButtons(
                ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
                form.job_type, setVal('job_type'),
                { 'Full-time': '#00C9B1', 'Part-time': '#38BDF8', 'Contract': '#A78BFA', 'Internship': '#FBBF24', 'Freelance': '#FB923C' }
              )}
            </div>

            <div>
              <label style={label}>Work Mode</label>
              {pillButtons(
                ['On-site', 'Remote', 'Hybrid'],
                form.work_mode, setVal('work_mode'),
                { 'On-site': '#00C9B1', 'Remote': '#38BDF8', 'Hybrid': '#A78BFA' }
              )}
            </div>
          </div>

          {/* ── Section 3: Experience & Skills ─────────────────────────────── */}
          <div style={card}>
            {sectionTitle(<Users size={18} color="#A78BFA" />, 'Experience & Skills')}
            <div style={{ marginBottom: 24 }}>
              <label style={label}>Experience Level</label>
              {pillButtons(
                ['Any', 'Fresher', '1-3 years', '3-5 years', '5-8 years', '8+ years'],
                form.experience, setVal('experience'),
              )}
            </div>
            <div>
              <label style={label}>Required Skills (comma-separated)</label>
              <input
                value={form.skills} onChange={set('skills')}
                placeholder="e.g. React, TypeScript, Node.js, AWS"
                style={focused('skills')}
                onFocus={() => setFocusedField('skills')}
                onBlur={() => setFocusedField('')}
              />
              <p style={{ fontSize: 12, color: '#4A6FA5', marginTop: 6 }}>
                These help job seekers find your listing through skill-based search.
              </p>
            </div>
          </div>

          {/* ── Section 4: Compensation ─────────────────────────────────────── */}
          <div style={card}>
            {sectionTitle(<DollarSign size={18} color="#FBBF24" />, 'Compensation (Optional)')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 16 }}>
              <div>
                <label style={label}>Min Salary (₹ LPA)</label>
                <input
                  type="number" min="0" value={form.min_salary} onChange={set('min_salary')}
                  placeholder="e.g. 8"
                  style={focused('min_salary')}
                  onFocus={() => setFocusedField('min_salary')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
              <div>
                <label style={label}>Max Salary (₹ LPA)</label>
                <input
                  type="number" min="0" value={form.max_salary} onChange={set('max_salary')}
                  placeholder="e.g. 15"
                  style={focused('max_salary')}
                  onFocus={() => setFocusedField('max_salary')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
              <div>
                <label style={label}>Currency</label>
                <select
                  value={form.salary_currency} onChange={set('salary_currency')}
                  style={{ ...focused('salary_currency'), cursor: 'pointer' }}
                  onFocus={() => setFocusedField('salary_currency')}
                  onBlur={() => setFocusedField('')}
                >
                  {['INR', 'USD', 'EUR', 'GBP', 'AED'].map(c => (
                    <option key={c} value={c} style={{ background: '#0A1628' }}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Section 5: Job Description ──────────────────────────────────── */}
          <div style={card}>
            {sectionTitle(<FileText size={18} color="#00C9B1" />, 'Job Description *')}
            <textarea
              value={form.description} onChange={set('description')} required
              rows={10}
              placeholder={`Describe the role, responsibilities, and what makes it exciting...\n\nExample:\n• Lead frontend development using React & TypeScript\n• Collaborate with design and backend teams\n• Minimum 3 years experience required`}
              style={{
                ...focused('description'),
                resize: 'vertical',
                lineHeight: 1.6,
                fontFamily: 'inherit',
              }}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField('')}
            />
            <div style={{
              display: 'flex', justifyContent: 'flex-end',
              fontSize: 12, color: form.description.length < 80 ? '#FB923C' : '#4A6FA5',
              marginTop: 6,
            }}>
              {form.description.length} / 80 min chars
            </div>
          </div>

          {/* ── Section 6: Apply & Contact ──────────────────────────────────── */}
          <div style={card}>
            {sectionTitle(<Mail size={18} color="#38BDF8" />, 'How to Apply')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={label}>Contact Email *</label>
                <input
                  type="email" value={form.contact_email} onChange={set('contact_email')} required
                  placeholder="hr@yourcompany.com"
                  style={focused('contact_email')}
                  onFocus={() => setFocusedField('contact_email')}
                  onBlur={() => setFocusedField('')}
                />
                <p style={{ fontSize: 12, color: '#4A6FA5', marginTop: 6 }}>
                  Used as fallback apply link. Not shown publicly.
                </p>
              </div>
              <div>
                <label style={label}>Application URL (optional)</label>
                <input
                  type="url" value={form.apply_url} onChange={set('apply_url')}
                  placeholder="https://yourcompany.com/careers/job-123"
                  style={focused('apply_url')}
                  onFocus={() => setFocusedField('apply_url')}
                  onBlur={() => setFocusedField('')}
                />
                <p style={{ fontSize: 12, color: '#4A6FA5', marginTop: 6 }}>
                  Candidates will be directed here to apply.
                </p>
              </div>
            </div>
          </div>

          {/* ── Error ────────────────────────────────────────────────────────── */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 18px', borderRadius: 12, marginBottom: 24,
              background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', fontSize: 14,
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* ── Submit ───────────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={stage === 'submitting'}
            style={{
              width: '100%', padding: '18px', borderRadius: 14,
              fontSize: 17, fontWeight: 800, cursor: stage === 'submitting' ? 'wait' : 'pointer',
              background: stage === 'submitting'
                ? 'rgba(0,201,177,0.4)'
                : 'linear-gradient(135deg, #00C9B1 0%, #0EA5E9 100%)',
              border: 'none', color: '#0A1628',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 4px 24px rgba(0,201,177,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {stage === 'submitting' ? (
              <>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid #0A162840',
                  borderTopColor: '#0A1628',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
                Publishing…
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Publish Job Listing — Free
              </>
            )}
          </button>

          <p style={{ textAlign: 'center', color: '#4A6FA5', fontSize: 12, marginTop: 16 }}>
            By posting you agree to our{' '}
            <span style={{ color: '#8B9DC3', cursor: 'pointer' }}>Terms of Service</span>.
            {' '}No spam, no credit card required.
          </p>

        </form>
      </div>

      {/* Keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
