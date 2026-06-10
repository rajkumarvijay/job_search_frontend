'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import {
  Mail, MessageSquare, Send, CheckCircle2, AlertCircle,
  MapPin, Clock, AtSign, ChevronDown, ChevronUp, ArrowRight,
} from 'lucide-react'

/* ---------------------------------------------------------------------------
   Data
--------------------------------------------------------------------------- */
const CONTACT_CARDS = [
  {
    icon: Mail,
    color: '#00C9B1',
    title: 'Email Us',
    value: 'support@jobquest.in',
    sub: 'We reply within 24 hours',
    href: 'mailto:support@jobquest.in',
  },
  {
    icon: AtSign,
    color: '#38BDF8',
    title: 'Twitter / X',
    value: '@JobQuestIndia',
    sub: 'DMs are open',
    href: 'https://twitter.com/JobQuestIndia',
  },
  {
    icon: MapPin,
    color: '#A78BFA',
    title: 'Based In',
    value: 'Bangalore, India',
    sub: 'Building for India, globally',
    href: null,
  },
]

const FAQS = [
  {
    q: 'Is JobQuest completely free to use?',
    a: 'Yes — searching jobs, saving listings, uploading your resume for an ATS score, and posting a job are all free. We offer optional paid plans for advanced filters and priority features.',
  },
  {
    q: 'Where do the job listings come from?',
    a: 'We aggregate in real time from LinkedIn, Indeed, Naukri, Glassdoor, ZipRecruiter, and Google Jobs. Every result links back to its original source so you can apply directly.',
  },
  {
    q: 'How does the AI resume scorer work?',
    a: 'You upload your resume (PDF, DOCX, or TXT) and our Gemini AI model analyses it against ATS criteria — keyword density, section structure, formatting, and relevance — returning a 0-100 score with prioritised fixes.',
  },
  {
    q: 'I posted a job and need to edit it. How?',
    a: 'Go to Post a Job → My Listings, enter the email you used when posting, and you\'ll see Edit and Delete options for every listing you own.',
  },
  {
    q: 'My search is returning no results. What should I try?',
    a: 'Try a broader query (e.g. "developer" instead of "senior TypeScript developer"), remove location filters, or select more platforms. Our backend fetches live — occasional portal downtime can also cause gaps.',
  },
  {
    q: 'How do I report a spam or inaccurate listing?',
    a: 'Use the contact form on this page with subject "Report Listing" and include the job URL. We review all reports within 48 hours.',
  },
]

const SUBJECTS = [
  'General Enquiry',
  'Report a Bug',
  'Report a Listing',
  'Partnership / Business',
  'Feature Request',
  'Press & Media',
  'Other',
]

/* ---------------------------------------------------------------------------
   FAQ item
--------------------------------------------------------------------------- */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 14,
      overflow: 'hidden', transition: 'border-color 0.2s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: 16,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#F0F4FF', lineHeight: 1.4 }}>{q}</span>
        <span style={{ flexShrink: 0, color: '#00C9B1' }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px', fontSize: 14, color: '#8B9DC3', lineHeight: 1.75, borderTop: '1px solid #1E3A5F' }}>
          <div style={{ paddingTop: 16 }}>{a}</div>
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Main Page
--------------------------------------------------------------------------- */
export default function ContactPage() {
  const RESET_DELAY = 4000 // ms to show success before auto-reset

  const [form, setForm]   = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [stage, setStage] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [focused, setFocused] = useState('')
  const [sentName, setSentName] = useState('')
  const [sentEmail, setSentEmail] = useState('')

  // Auto-reset after success
  useEffect(() => {
    if (stage !== 'sent') return
    const t = setTimeout(() => {
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' })
      setStage('idle')
    }, RESET_DELAY)
    return () => clearTimeout(t)
  }, [stage])

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }))

  const inp = (f: string): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box',
    background: '#0A1628', border: `1.5px solid ${focused === f ? '#00C9B1' : '#1E3A5F'}`,
    borderRadius: 10, padding: '12px 16px', color: '#F0F4FF',
    fontSize: 15, outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSentName(form.name)
    setSentEmail(form.email)
    setStage('sending')
    setTimeout(() => setStage('sent'), 1800)
  }

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh' }}>

      {/* ===== HERO ===== */}
      <section style={{ padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 18px', borderRadius: 999, marginBottom: 24,
            background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)',
            color: '#00C9B1', fontSize: 13, fontWeight: 600,
          }}>
            <MessageSquare size={13} /> Get In Touch
          </div>
          <h1 style={{
            fontSize: 'clamp(30px,5vw,52px)', fontWeight: 900,
            letterSpacing: '-0.035em', color: '#F0F4FF', lineHeight: 1.08, marginBottom: 18,
          }}>
            We&apos;d love to{' '}
            <span style={{ background: 'linear-gradient(90deg,#00C9B1,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              hear from you
            </span>
          </h1>
          <p style={{ fontSize: 17, color: '#8B9DC3', lineHeight: 1.7 }}>
            Bug report, partnership enquiry, feature idea, or just a hello —
            drop us a message and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* ===== CONTACT CARDS ===== */}
      <section style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            {CONTACT_CARDS.map(({ icon: Icon, color, title, value, sub, href }) => {
              const inner = (
                <div style={{
                  background: '#0F2044', border: `1px solid ${color}22`,
                  borderRadius: 18, padding: '24px 22px',
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  transition: 'all 0.2s', cursor: href ? 'pointer' : 'default',
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#4A6FA5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#F0F4FF', marginBottom: 3 }}>{value}</div>
                    <div style={{ fontSize: 12, color: '#8B9DC3' }}>{sub}</div>
                  </div>
                </div>
              )
              return href ? (
                <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer" style={{ textDecoration: 'none' }}
                  onMouseEnter={e => ((e.currentTarget.firstChild as HTMLDivElement).style.borderColor = color)}
                  onMouseLeave={e => ((e.currentTarget.firstChild as HTMLDivElement).style.borderColor = `${color}22`)}
                >
                  {inner}
                </a>
              ) : <div key={title}>{inner}</div>
            })}
          </div>
        </div>
      </section>

      {/* ===== FORM + FAQ GRID ===== */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))', gap: 28, alignItems: 'start' }}>

          {/* Contact Form */}
          <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 24, padding: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(0,201,177,0.12)', border: '1px solid rgba(0,201,177,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={17} color="#00C9B1" />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#F0F4FF' }}>Send a Message</div>
                <div style={{ fontSize: 12, color: '#4A6FA5', marginTop: 1 }}>Usually replied within 24 hours</div>
              </div>
            </div>

            {stage === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '36px 0' }}>
                {/* Success icon */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                  background: 'rgba(74,222,128,0.12)', border: '2px solid rgba(74,222,128,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 32px rgba(74,222,128,0.18)',
                  animation: 'popIn 0.35s cubic-bezier(.175,.885,.32,1.275)',
                }}>
                  <CheckCircle2 size={36} color="#4ADE80" />
                </div>

                <div style={{ fontSize: 22, fontWeight: 900, color: '#F0F4FF', marginBottom: 10 }}>
                  Message Sent!
                </div>
                <p style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.75, marginBottom: 28 }}>
                  Thanks <strong style={{ color: '#F0F4FF' }}>{sentName}</strong>! We&apos;ll reply to{' '}
                  <strong style={{ color: '#F0F4FF' }}>{sentEmail}</strong> within 24 hours.
                </p>

                {/* Auto-reset countdown bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: '#4A6FA5', marginBottom: 8 }}>
                    Form resets automatically in a moment…
                  </div>
                  <div style={{ height: 4, borderRadius: 999, background: '#1E3A5F', overflow: 'hidden', maxWidth: 240, margin: '0 auto' }}>
                    <div style={{
                      height: '100%', borderRadius: 999,
                      background: 'linear-gradient(90deg,#4ADE80,#00C9B1)',
                      animation: `drainBar ${RESET_DELAY}ms linear forwards`,
                    }} />
                  </div>
                </div>

                {/* Manual reset option */}
                <button
                  onClick={() => { setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' }); setStage('idle') }}
                  style={{
                    padding: '10px 22px', borderRadius: 10,
                    background: 'rgba(0,201,177,0.08)', border: '1.5px solid rgba(0,201,177,0.25)',
                    color: '#00C9B1', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name *</label>
                      <input value={form.name} onChange={set('name')} required placeholder="Priya Sharma"
                        style={inp('name')} onFocus={() => setFocused('name')} onBlur={() => setFocused('')} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email *</label>
                      <input type="email" value={form.email} onChange={set('email')} required placeholder="priya@example.com"
                        style={inp('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subject</label>
                    <select value={form.subject} onChange={set('subject')}
                      style={{ ...inp('subject'), cursor: 'pointer' }}
                      onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}>
                      {SUBJECTS.map(s => <option key={s} value={s} style={{ background: '#0A1628' }}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Message *</label>
                    <textarea value={form.message} onChange={set('message')} required rows={6}
                      placeholder="Tell us what's on your mind..."
                      style={{ ...inp('message'), resize: 'vertical', lineHeight: 1.6 }}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused('')} />
                    <div style={{ textAlign: 'right', fontSize: 11, color: form.message.length < 20 ? '#FB923C' : '#4A6FA5', marginTop: 4 }}>
                      {form.message.length} / 20 min chars
                    </div>
                  </div>

                  {stage === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', fontSize: 13 }}>
                      <AlertCircle size={14} /> Something went wrong. Please try again.
                    </div>
                  )}

                  <button type="submit" disabled={stage === 'sending'} style={{
                    padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 800,
                    border: 'none', cursor: stage === 'sending' ? 'wait' : 'pointer',
                    background: stage === 'sending' ? 'rgba(0,201,177,0.4)' : 'linear-gradient(135deg,#00C9B1,#0EA5E9)',
                    color: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    transition: 'all 0.2s',
                  }}>
                    {stage === 'sending' ? (
                      <>
                        <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #0A162840', borderTopColor: '#0A1628', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                        Sending...
                      </>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>

                </div>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={17} color="#A78BFA" />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#F0F4FF' }}>Frequently Asked</div>
                <div style={{ fontSize: 12, color: '#4A6FA5', marginTop: 1 }}>Quick answers to common questions</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FAQS.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ===== RESPONSE BANNER ===== */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg,rgba(56,189,248,0.07) 0%,rgba(10,22,40,0.9) 100%)',
            border: '1px solid rgba(56,189,248,0.2)', borderRadius: 20,
            padding: '32px 36px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={24} color="#38BDF8" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#F0F4FF', marginBottom: 4 }}>Our Response Commitment</div>
              <div style={{ fontSize: 14, color: '#8B9DC3', lineHeight: 1.6 }}>
                Bug reports are triaged within <strong style={{ color: '#38BDF8' }}>4 hours</strong>. General enquiries within <strong style={{ color: '#38BDF8' }}>24 hours</strong>. Partnership discussions within <strong style={{ color: '#38BDF8' }}>48 hours</strong>.
              </div>
            </div>
            <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 22px', borderRadius: 12, textDecoration: 'none', background: 'rgba(56,189,248,0.1)', border: '1.5px solid rgba(56,189,248,0.3)', color: '#38BDF8', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
              Back to JobQuest <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes popIn   { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
        @keyframes drainBar{ from { width:100%; } to { width:0%; } }
      `}</style>
    </div>
  )
}
