'use client'

import { useState, FormEvent, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Briefcase, MapPin, DollarSign, FileText, Mail,
  CheckCircle2, AlertCircle, ChevronRight, Sparkles,
  Users, Globe, PlusCircle, ListChecks,
  Pencil, Trash2, X, Search, Calendar, Building2,
} from 'lucide-react'
import { postJobApi } from '@/lib/api'
import { INDIA_CITIES } from '@/lib/constants'
import type { PostedJobOut } from '@/types'

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */
type Tab   = 'post' | 'manage'
type Stage = 'idle' | 'submitting' | 'success'

interface FormData {
  title: string; company: string; location: string; customLocation: string
  job_type: string; work_mode: string; experience: string
  min_salary: string; max_salary: string; salary_currency: string
  description: string; skills: string; contact_email: string
  apply_url: string; company_url: string
}

const EMPTY: FormData = {
  title: '', company: '', location: 'India', customLocation: '',
  job_type: 'Full-time', work_mode: 'On-site', experience: 'Any',
  min_salary: '', max_salary: '', salary_currency: 'INR',
  description: '', skills: '', contact_email: '',
  apply_url: '', company_url: '',
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED STYLE HELPERS
═══════════════════════════════════════════════════════════════════════════ */
const card: React.CSSProperties = {
  background: '#0F2044', border: '1px solid #1E3A5F',
  borderRadius: 16, padding: '32px', marginBottom: 24,
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: '#8B9DC3', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase',
}
const baseInput: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#0A1628', border: '1.5px solid #1E3A5F', borderRadius: 10,
  padding: '12px 16px', color: '#F0F4FF', fontSize: 15, outline: 'none',
  transition: 'border-color 0.2s',
}

function SectionHeader({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(0,201,177,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#F0F4FF' }}>{text}</h2>
    </div>
  )
}

function PillGroup({
  options, value, onChange, colorMap,
}: {
  options: string[]; value: string; onChange: (v: string) => void; colorMap?: Record<string, string>
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const active = value === opt
        const color = colorMap?.[opt] ?? '#00C9B1'
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)} style={{
            padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.18s',
            border: `1.5px solid ${active ? color : '#1E3A5F'}`,
            background: active ? `${color}18` : 'transparent',
            color: active ? color : '#8B9DC3',
          }}>{opt}</button>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   JOB FORM  (create + edit)
═══════════════════════════════════════════════════════════════════════════ */
function JobForm({
  initialData = EMPTY,
  editJobId,
  ownerEmail,
  onSuccess,
}: {
  initialData?: FormData
  editJobId?: string        // set when editing
  ownerEmail?: string       // set when editing
  onSuccess: (jobId: string, title: string) => void
}) {
  const [form, setForm] = useState<FormData>(initialData)
  const [stage, setStage] = useState<Stage>('idle')
  const [error, setError] = useState('')
  const [focused, setFocused] = useState('')

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }))
  const setVal = (key: keyof FormData) => (v: string) => setForm(p => ({ ...p, [key]: v }))

  const inp = (field: string): React.CSSProperties => ({
    ...baseInput, borderColor: focused === field ? '#00C9B1' : '#1E3A5F',
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim())        return setError('Job title is required.')
    if (!form.company.trim())      return setError('Company name is required.')
    if (!form.contact_email.trim())return setError('Contact email is required.')
    if (form.description.trim().length < 80)
      return setError('Description must be at least 80 characters.')

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

      if (editJobId && ownerEmail) {
        // EDIT mode
        await postJobApi.update(editJobId, { ...payload, owner_email: ownerEmail })
        onSuccess(editJobId, form.title)
      } else {
        // CREATE mode
        const { data } = await postJobApi.submit(payload)
        onSuccess(data.job_id ?? '', form.title)
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? 'Something went wrong. Please try again.'
      setError(msg)
      setStage('idle')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Basic Info */}
      <div style={card}>
        <SectionHeader icon={<Briefcase size={18} color="#00C9B1" />} text="Basic Information" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Job Title *</label>
            <input value={form.title} onChange={set('title')} required
              placeholder="e.g. Senior React Developer" style={inp('title')}
              onFocus={() => setFocused('title')} onBlur={() => setFocused('')} />
          </div>
          <div>
            <label style={labelStyle}>Company Name *</label>
            <input value={form.company} onChange={set('company')} required
              placeholder="e.g. Acme Technologies" style={inp('company')}
              onFocus={() => setFocused('company')} onBlur={() => setFocused('')} />
          </div>
          <div>
            <label style={labelStyle}>Company Website</label>
            <input value={form.company_url} onChange={set('company_url')} type="url"
              placeholder="https://yourcompany.com" style={inp('company_url')}
              onFocus={() => setFocused('company_url')} onBlur={() => setFocused('')} />
          </div>
        </div>
      </div>

      {/* Location & Type */}
      <div style={card}>
        <SectionHeader icon={<MapPin size={18} color="#38BDF8" />} text="Location & Job Type" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>City / Location</label>
            <select value={form.location} onChange={set('location')}
              style={{ ...inp('location'), cursor: 'pointer' }}
              onFocus={() => setFocused('location')} onBlur={() => setFocused('')}>
              {INDIA_CITIES.map(c => <option key={c} value={c} style={{ background: '#0A1628' }}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Custom Location (optional)</label>
            <input value={form.customLocation} onChange={set('customLocation')}
              placeholder="e.g. Whitefield, Bangalore" style={inp('customLocation')}
              onFocus={() => setFocused('customLocation')} onBlur={() => setFocused('')} />
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Job Type</label>
          <PillGroup options={['Full-time','Part-time','Contract','Internship','Freelance']}
            value={form.job_type} onChange={setVal('job_type')}
            colorMap={{ 'Full-time':'#00C9B1','Part-time':'#38BDF8','Contract':'#A78BFA','Internship':'#FBBF24','Freelance':'#FB923C' }} />
        </div>
        <div>
          <label style={labelStyle}>Work Mode</label>
          <PillGroup options={['On-site','Remote','Hybrid']} value={form.work_mode} onChange={setVal('work_mode')}
            colorMap={{ 'On-site':'#00C9B1','Remote':'#38BDF8','Hybrid':'#A78BFA' }} />
        </div>
      </div>

      {/* Experience & Skills */}
      <div style={card}>
        <SectionHeader icon={<Users size={18} color="#A78BFA" />} text="Experience & Skills" />
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Experience Level</label>
          <PillGroup options={['Any','Fresher','1-3 years','3-5 years','5-8 years','8+ years']}
            value={form.experience} onChange={setVal('experience')} />
        </div>
        <div>
          <label style={labelStyle}>Required Skills (comma-separated)</label>
          <input value={form.skills} onChange={set('skills')}
            placeholder="e.g. React, TypeScript, Node.js, AWS" style={inp('skills')}
            onFocus={() => setFocused('skills')} onBlur={() => setFocused('')} />
        </div>
      </div>

      {/* Compensation */}
      <div style={card}>
        <SectionHeader icon={<DollarSign size={18} color="#FBBF24" />} text="Compensation (Optional)" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 16 }}>
          <div>
            <label style={labelStyle}>Min Salary (₹ LPA)</label>
            <input type="number" min="0" value={form.min_salary} onChange={set('min_salary')}
              placeholder="e.g. 8" style={inp('min_salary')}
              onFocus={() => setFocused('min_salary')} onBlur={() => setFocused('')} />
          </div>
          <div>
            <label style={labelStyle}>Max Salary (₹ LPA)</label>
            <input type="number" min="0" value={form.max_salary} onChange={set('max_salary')}
              placeholder="e.g. 15" style={inp('max_salary')}
              onFocus={() => setFocused('max_salary')} onBlur={() => setFocused('')} />
          </div>
          <div>
            <label style={labelStyle}>Currency</label>
            <select value={form.salary_currency} onChange={set('salary_currency')}
              style={{ ...inp('salary_currency'), cursor: 'pointer' }}
              onFocus={() => setFocused('salary_currency')} onBlur={() => setFocused('')}>
              {['INR','USD','EUR','GBP','AED'].map(c =>
                <option key={c} value={c} style={{ background: '#0A1628' }}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={card}>
        <SectionHeader icon={<FileText size={18} color="#00C9B1" />} text="Job Description *" />
        <textarea value={form.description} onChange={set('description')} required rows={10}
          placeholder={`Describe the role, responsibilities, and requirements...\n\n• Lead frontend development\n• 3+ years experience required`}
          style={{ ...inp('description'), resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit' }}
          onFocus={() => setFocused('description')} onBlur={() => setFocused('')} />
        <div style={{
          display: 'flex', justifyContent: 'flex-end', fontSize: 12, marginTop: 6,
          color: form.description.length < 80 ? '#FB923C' : '#4A6FA5',
        }}>
          {form.description.length} / 80 min chars
        </div>
      </div>

      {/* Contact */}
      <div style={card}>
        <SectionHeader icon={<Mail size={18} color="#38BDF8" />} text="How to Apply" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={labelStyle}>Contact Email *</label>
            <input type="email" value={form.contact_email} onChange={set('contact_email')} required
              placeholder="hr@yourcompany.com" style={inp('contact_email')}
              onFocus={() => setFocused('contact_email')} onBlur={() => setFocused('')}
              readOnly={!!editJobId}
              title={editJobId ? 'Email cannot be changed' : ''} />
            {editJobId && (
              <p style={{ fontSize: 12, color: '#4A6FA5', marginTop: 6 }}>
                Email is locked — it's used to verify ownership.
              </p>
            )}
          </div>
          <div>
            <label style={labelStyle}>Application URL (optional)</label>
            <input type="url" value={form.apply_url} onChange={set('apply_url')}
              placeholder="https://yourcompany.com/careers/..." style={inp('apply_url')}
              onFocus={() => setFocused('apply_url')} onBlur={() => setFocused('')} />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px',
          borderRadius: 12, marginBottom: 24,
          background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.3)',
          color: '#FCA5A5', fontSize: 14,
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={stage === 'submitting'} style={{
        width: '100%', padding: '18px', borderRadius: 14, fontSize: 17, fontWeight: 800,
        cursor: stage === 'submitting' ? 'wait' : 'pointer', border: 'none', color: '#0A1628',
        background: stage === 'submitting'
          ? 'rgba(0,201,177,0.4)'
          : 'linear-gradient(135deg, #00C9B1 0%, #0EA5E9 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        boxShadow: '0 4px 24px rgba(0,201,177,0.3)', transition: 'all 0.2s',
      }}>
        {stage === 'submitting' ? (
          <><span style={{
            width: 18, height: 18, borderRadius: '50%',
            border: '2px solid #0A162840', borderTopColor: '#0A1628',
            animation: 'spin 0.7s linear infinite', display: 'inline-block',
          }} /> {editJobId ? 'Saving…' : 'Publishing…'}</>
        ) : (
          <><Sparkles size={18} /> {editJobId ? 'Save Changes' : 'Publish Job Listing — Free'}</>
        )}
      </button>
    </form>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DELETE CONFIRM MODAL
═══════════════════════════════════════════════════════════════════════════ */
function DeleteModal({
  job, email, onConfirm, onCancel,
}: {
  job: PostedJobOut; email: string; onConfirm: () => void; onCancel: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function confirm() {
    setBusy(true); setErr('')
    try {
      await postJobApi.remove(job.job_id, email)
      onConfirm()
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? 'Delete failed. Please try again.'
      setErr(msg); setBusy(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 20,
        padding: 36, maxWidth: 440, width: '100%',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        }}>
          <Trash2 size={24} color="#EF4444" />
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#F0F4FF' }}>
          Remove this listing?
        </h3>
        <p style={{ margin: '0 0 6px', color: '#8B9DC3', fontSize: 14, lineHeight: 1.5 }}>
          <strong style={{ color: '#F0F4FF' }}>{job.title}</strong> at {job.company} will be
          removed from search results immediately.
        </p>
        <p style={{ margin: '0 0 24px', color: '#4A6FA5', fontSize: 12 }}>
          This action cannot be undone.
        </p>
        {err && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
            borderRadius: 10, marginBottom: 16,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#FCA5A5', fontSize: 13,
          }}>
            <AlertCircle size={14} /> {err}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} disabled={busy} style={{
            flex: 1, padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            background: 'transparent', border: '1.5px solid #1E3A5F',
            color: '#8B9DC3', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={confirm} disabled={busy} style={{
            flex: 1, padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: busy ? 'rgba(239,68,68,0.4)' : '#EF4444',
            border: 'none', color: '#fff', cursor: busy ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            {busy ? 'Removing…' : <><Trash2 size={14} /> Remove Listing</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MY LISTINGS TAB
═══════════════════════════════════════════════════════════════════════════ */
function MyListings() {
  const [email, setEmail] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [jobs, setJobs] = useState<PostedJobOut[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [err, setErr] = useState('')
  const [editJob, setEditJob] = useState<PostedJobOut | null>(null)
  const [deleteJob, setDeleteJob] = useState<PostedJobOut | null>(null)
  const [editSuccess, setEditSuccess] = useState('')

  async function fetchJobs(e: FormEvent) {
    e.preventDefault()
    if (!inputEmail.trim()) return
    setLoading(true); setErr(''); setFetched(false)
    try {
      const { data } = await postJobApi.byEmail(inputEmail.trim())
      setJobs(data)
      setEmail(inputEmail.trim())
      setFetched(true)
    } catch {
      setErr('Could not load jobs. Please check your email and try again.')
    } finally {
      setLoading(false)
    }
  }

  function toFormData(j: PostedJobOut): FormData {
    return {
      title: j.title, company: j.company,
      location: INDIA_CITIES.includes(j.location) ? j.location : 'India',
      customLocation: INDIA_CITIES.includes(j.location) ? '' : j.location,
      job_type: j.job_type ?? 'Full-time', work_mode: j.work_mode ?? 'On-site',
      experience: j.experience ?? 'Any',
      min_salary: j.min_salary != null ? String(j.min_salary) : '',
      max_salary: j.max_salary != null ? String(j.max_salary) : '',
      salary_currency: j.salary_currency ?? 'INR',
      description: j.description, skills: j.skills ?? '',
      contact_email: j.contact_email,
      apply_url: j.apply_url ?? '', company_url: j.company_url ?? '',
    }
  }

  function handleEditSuccess(jobId: string, title: string) {
    setEditJob(null)
    setEditSuccess(`"${title}" updated successfully.`)
    // re-fetch
    postJobApi.byEmail(email).then(({ data }) => setJobs(data)).catch(() => {})
    setTimeout(() => setEditSuccess(''), 4000)
  }

  function handleDeleteSuccess() {
    setDeleteJob(null)
    setJobs(prev => prev.filter(j => j.job_id !== deleteJob?.job_id))
  }

  /* — Edit view — */
  if (editJob) {
    return (
      <div>
        <button onClick={() => setEditJob(null)} style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'transparent',
          border: 'none', color: '#8B9DC3', cursor: 'pointer', fontSize: 14, marginBottom: 24,
        }}>
          <X size={15} /> Back to My Listings
        </button>
        <div style={{
          background: 'rgba(0,201,177,0.06)', border: '1px solid rgba(0,201,177,0.2)',
          borderRadius: 12, padding: '12px 18px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 10, color: '#00C9B1', fontSize: 14,
        }}>
          <Pencil size={15} />
          Editing: <strong>{editJob.title}</strong> at {editJob.company}
        </div>
        <JobForm
          initialData={toFormData(editJob)}
          editJobId={editJob.job_id}
          ownerEmail={email}
          onSuccess={handleEditSuccess}
        />
      </div>
    )
  }

  return (
    <div>
      {/* Email lookup */}
      <div style={card}>
        <SectionHeader icon={<Search size={18} color="#38BDF8" />} text="Find My Job Listings" />
        <p style={{ color: '#8B9DC3', fontSize: 14, marginBottom: 20, marginTop: -8 }}>
          Enter the email address you used when posting to view, edit, or delete your listings.
        </p>
        <form onSubmit={fetchJobs} style={{ display: 'flex', gap: 12 }}>
          <input
            type="email" value={inputEmail}
            onChange={e => setInputEmail(e.target.value)}
            placeholder="Enter your contact email…"
            required
            style={{ ...baseInput, flex: 1, borderColor: '#1E3A5F' }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: 'linear-gradient(135deg, #00C9B1, #0EA5E9)',
            border: 'none', color: '#0A1628', cursor: loading ? 'wait' : 'pointer',
            whiteSpace: 'nowrap', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {loading ? 'Loading…' : <><Search size={14} /> View Listings</>}
          </button>
        </form>
        {err && (
          <div style={{
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
            color: '#FCA5A5', fontSize: 13,
          }}>
            <AlertCircle size={14} /> {err}
          </div>
        )}
      </div>

      {/* Edit success toast */}
      {editSuccess && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px',
          borderRadius: 12, marginBottom: 20,
          background: 'rgba(0,201,177,0.08)', border: '1.5px solid rgba(0,201,177,0.3)',
          color: '#00C9B1', fontSize: 14,
        }}>
          <CheckCircle2 size={16} /> {editSuccess}
        </div>
      )}

      {/* Results */}
      {fetched && (
        jobs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            color: '#8B9DC3', fontSize: 15,
          }}>
            <ListChecks size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>No active listings found for <strong>{email}</strong></p>
            <p style={{ fontSize: 13, color: '#4A6FA5' }}>
              Double-check your email or post a new job from the Post tab.
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: '#8B9DC3', fontSize: 13, marginBottom: 16 }}>
              {jobs.length} listing{jobs.length !== 1 ? 's' : ''} found for <strong style={{ color: '#F0F4FF' }}>{email}</strong>
            </p>
            {jobs.map(job => (
              <JobManageCard
                key={job.job_id} job={job}
                onEdit={() => setEditJob(job)}
                onDelete={() => setDeleteJob(job)}
              />
            ))}
          </div>
        )
      )}

      {/* Delete modal */}
      {deleteJob && (
        <DeleteModal
          job={deleteJob} email={email}
          onConfirm={handleDeleteSuccess}
          onCancel={() => setDeleteJob(null)}
        />
      )}
    </div>
  )
}

/* ── Single job management card ─────────────────────────────────────────── */
function JobManageCard({
  job, onEdit, onDelete,
}: { job: PostedJobOut; onEdit: () => void; onDelete: () => void }) {
  const salaryText = job.min_salary
    ? `${job.salary_currency ?? 'INR'} ${job.min_salary}${job.max_salary ? `–${job.max_salary}` : '+'} LPA`
    : null

  const postedDate = job.posted_at
    ? new Date(job.posted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div style={{
      background: '#0F2044', border: '1px solid #1E3A5F',
      borderRadius: 16, padding: '24px', marginBottom: 16,
      transition: 'border-color 0.2s',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#F0F4FF' }}>
            {job.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B9DC3', fontSize: 14 }}>
            <Building2 size={13} /> {job.company}
          </div>
        </div>
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={onEdit} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: 'rgba(0,201,177,0.08)', border: '1.5px solid rgba(0,201,177,0.25)',
            color: '#00C9B1', cursor: 'pointer', transition: 'all 0.18s',
          }}>
            <Pencil size={13} /> Edit
          </button>
          <button onClick={onDelete} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.25)',
            color: '#EF4444', cursor: 'pointer', transition: 'all 0.18s',
          }}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
        {job.location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#8B9DC3' }}>
            <MapPin size={12} /> {job.location}
          </span>
        )}
        {job.work_mode && <Chip text={job.work_mode} color="#38BDF8" />}
        {job.job_type  && <Chip text={job.job_type}  color="#00C9B1" />}
        {job.experience && job.experience !== 'Any' && <Chip text={job.experience} color="#A78BFA" />}
        {salaryText    && <Chip text={salaryText}     color="#FBBF24" />}
        {postedDate    && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4A6FA5', marginLeft: 'auto' }}>
            <Calendar size={11} /> {postedDate}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {job.skills.split(',').slice(0, 6).map(s => s.trim()).filter(Boolean).map(s => (
            <span key={s} style={{
              padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
              background: 'rgba(255,255,255,0.04)', border: '1px solid #1E3A5F',
              color: '#8B9DC3',
            }}>{s}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function Chip({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: `${color}15`, border: `1px solid ${color}40`, color,
    }}>{text}</span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUCCESS SCREEN
═══════════════════════════════════════════════════════════════════════════ */
function SuccessScreen({
  jobId, title, onReset,
}: { jobId: string; title: string; onReset: () => void }) {
  const router = useRouter()
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '40px 24px',
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
        <h2 style={{ fontSize: 30, fontWeight: 900, color: '#F0F4FF', marginBottom: 12 }}>
          Job Posted!
        </h2>
        <p style={{ color: '#8B9DC3', fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>
          Your listing is now live on <strong style={{ color: '#00C9B1' }}>JobQuest</strong> and
          will appear in relevant search results.
        </p>
        {jobId && (
          <p style={{ color: '#4A6FA5', fontSize: 12, marginBottom: 32 }}>
            Job ID: <code style={{ color: '#8B9DC3' }}>{jobId}</code>
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onReset} style={{
            padding: '12px 24px', borderRadius: 12, fontSize: 15, fontWeight: 600,
            background: 'rgba(0,201,177,0.1)', border: '1.5px solid rgba(0,201,177,0.3)',
            color: '#00C9B1', cursor: 'pointer',
          }}>
            Post Another Job
          </button>
          <button onClick={() => router.push(`/search?q=${encodeURIComponent(title)}`)} style={{
            padding: '12px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700,
            background: 'linear-gradient(135deg, #00C9B1 0%, #0EA5E9 100%)',
            border: 'none', color: '#0A1628', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            View in Search <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT PAGE COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export function PostJobClient() {
  const [tab, setTab] = useState<Tab>('post')
  const [successJobId, setSuccessJobId] = useState('')
  const [successTitle, setSuccessTitle] = useState('')

  function handlePostSuccess(jobId: string, title: string) {
    setSuccessJobId(jobId)
    setSuccessTitle(title)
  }

  function handleReset() {
    setSuccessJobId('')
    setSuccessTitle('')
  }

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
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
            fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-0.03em', color: '#F0F4FF', marginBottom: 12,
          }}>
            Post a Job on{' '}
            <span style={{
              background: 'linear-gradient(90deg, #00C9B1, #38BDF8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>JobQuest</span>
          </h1>
          <p style={{ color: '#8B9DC3', fontSize: 16, maxWidth: 460, margin: '0 auto 24px' }}>
            Reach thousands of active job seekers across India — completely free.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 36, flexWrap: 'wrap' }}>
            {[
              { icon: <Users size={13} color="#00C9B1" />, text: '485K+ Job Seekers' },
              { icon: <Globe size={13} color="#38BDF8" />, text: '45+ Cities' },
              { icon: <Briefcase size={13} color="#A78BFA" />, text: '6 Portals · 1 Post' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B9DC3', fontSize: 13 }}>
                {icon} {text}
              </div>
            ))}
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 32,
          background: '#0F2044', border: '1px solid #1E3A5F',
          borderRadius: 14, padding: 4,
        }}>
          {([
            { key: 'post',   icon: <PlusCircle size={15} />,   label: 'Post a Job' },
            { key: 'manage', icon: <ListChecks size={15} />,   label: 'My Listings' },
          ] as { key: Tab; icon: React.ReactNode; label: string }[]).map(({ key, icon, label }) => (
            <button key={key} onClick={() => { setTab(key); handleReset() }} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: tab === key ? 'linear-gradient(135deg, rgba(0,201,177,0.15), rgba(14,165,233,0.15))' : 'transparent',
              color: tab === key ? '#00C9B1' : '#8B9DC3',
              boxShadow: tab === key ? 'inset 0 0 0 1.5px rgba(0,201,177,0.3)' : 'none',
            }}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'post' && (
          successJobId
            ? <SuccessScreen jobId={successJobId} title={successTitle} onReset={handleReset} />
            : <JobForm onSuccess={handlePostSuccess} />
        )}
        {tab === 'manage' && <MyListings />}

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
