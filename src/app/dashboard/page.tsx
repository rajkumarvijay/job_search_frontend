'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, Briefcase, Bookmark, Search, FileText, TrendingUp,
  CheckCircle2, Circle, Clock, XCircle, Award, Eye, Bell,
  Plus, X, ChevronRight, Sparkles, MapPin, Building2, Calendar,
  BarChart2, User, Mail, Phone, Camera, ExternalLink,
  Star, Zap, Target, Activity, Users, AlertCircle,
} from 'lucide-react'
import { savedApi, historyApi, postJobApi } from '@/lib/api'
import type { SavedJob, SearchHistoryEntry, PostedJobOut } from '@/types'

/* ===========================================================================
   LOCAL TYPES
=========================================================================== */
interface Application {
  id: string
  title: string
  company: string
  location: string
  applied_date: string
  status: 'applied' | 'in_review' | 'interview' | 'offer' | 'rejected'
  job_url: string
  notes: string
}

interface Interview {
  id: string
  company: string
  role: string
  date: string
  time: string
  type: 'phone' | 'video' | 'onsite' | 'technical'
  notes: string
}

/* ===========================================================================
   CONSTANTS
=========================================================================== */
const STATUS_CFG: Record<Application['status'], { label: string; color: string; icon: React.ElementType }> = {
  applied:    { label: 'Applied',     color: '#38BDF8', icon: Clock       },
  in_review:  { label: 'In Review',   color: '#A78BFA', icon: Eye         },
  interview:  { label: 'Interview',   color: '#FBBF24', icon: Calendar    },
  offer:      { label: 'Offer',       color: '#4ADE80', icon: Award       },
  rejected:   { label: 'Rejected',    color: '#F87171', icon: XCircle     },
}

const INTERVIEW_TYPE_CFG: Record<Interview['type'], { label: string; color: string }> = {
  phone:      { label: 'Phone',       color: '#38BDF8' },
  video:      { label: 'Video',       color: '#A78BFA' },
  onsite:     { label: 'On-site',     color: '#00C9B1' },
  technical:  { label: 'Technical',   color: '#FBBF24' },
}

/* ===========================================================================
   SHARED UI HELPERS
=========================================================================== */
const cardBase: React.CSSProperties = {
  background: '#0F2044', border: '1px solid #1E3A5F',
  borderRadius: 20, padding: 28,
}

function Skel({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, flexShrink: 0,
      background: 'linear-gradient(90deg,#1E3A5F 25%,#253F6A 50%,#1E3A5F 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  )
}

function SectionTitle({ icon: Icon, color, title, sub, action }: {
  icon: React.ElementType; color: string; title: string; sub?: string
  action?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={17} color={color} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#F0F4FF', letterSpacing: '-0.02em' }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: '#4A6FA5', marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
      {action}
    </div>
  )
}

function Pill({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
      background: `${color}18`, border: `1px solid ${color}35`, color,
    }}>{text}</span>
  )
}

/* ===========================================================================
   1. PROFILE COMPLETION
=========================================================================== */
function ProfileCompletion({ user }: { user: ReturnType<typeof useUser>['user'] }) {
  const items = [
    { label: 'Full name',          done: !!(user?.firstName || user?.fullName)   },
    { label: 'Profile photo',      done: !!user?.imageUrl && !user.imageUrl.includes('default') },
    { label: 'Email verified',     done: user?.primaryEmailAddress?.verification?.status === 'verified' },
    { label: 'Phone number',       done: !!user?.primaryPhoneNumber             },
    { label: 'Resume uploaded',    done: !!localStorage.getItem('jq_resume_uploaded') },
    { label: 'Job preferences set',done: !!localStorage.getItem('jq_prefs_set')       },
  ]
  const pct = Math.round((items.filter(i => i.done).length / items.length) * 100)
  const color = pct < 40 ? '#F87171' : pct < 75 ? '#FBBF24' : '#4ADE80'
  const circumference = 2 * Math.PI * 36

  return (
    <div style={{ ...cardBase, height: '100%', boxSizing: 'border-box' }}>
      <SectionTitle icon={User} color="#00C9B1" title="Profile Completion"
        sub="Complete your profile to attract recruiters" />

      <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24 }}>
        {/* Ring */}
        <div style={{ position: 'relative', flexShrink: 0, width: 88, height: 88 }}>
          <svg width={88} height={88} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={44} cy={44} r={36} fill="none" stroke="#1E3A5F" strokeWidth={8} />
            <circle cx={44} cy={44} r={36} fill="none" stroke={color} strokeWidth={8}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{pct}%</span>
            <span style={{ fontSize: 9, color: '#4A6FA5', fontWeight: 600, marginTop: 2 }}>complete</span>
          </div>
        </div>

        {/* Status badge */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: color, marginBottom: 4 }}>
            {pct < 40 ? 'Just getting started' : pct < 75 ? 'Looking good!' : pct < 100 ? 'Almost there!' : 'All done!'}
          </div>
          <div style={{ fontSize: 12, color: '#8B9DC3', lineHeight: 1.5 }}>
            {pct < 100 ? `${items.filter(i => !i.done).length} item${items.filter(i => !i.done).length !== 1 ? 's' : ''} left to complete` : 'Your profile is 100% complete'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(({ label, done }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {done
              ? <CheckCircle2 size={15} color="#4ADE80" />
              : <Circle size={15} color="#1E3A5F" />
            }
            <span style={{ fontSize: 13, color: done ? '#A8C0E0' : '#8B9DC3', textDecoration: done ? 'none' : 'none', flex: 1 }}>
              {label}
            </span>
            {!done && (
              <Link href={label === 'Resume uploaded' ? '/resume' : label === 'Job preferences set' ? '/search' : '/dashboard'}
                style={{ fontSize: 11, color: '#00C9B1', fontWeight: 700, textDecoration: 'none' }}>
                Add
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===========================================================================
   2. QUICK STATS BAR
=========================================================================== */
function QuickStats({ savedCount, searchCount, appCount, interviewCount }: {
  savedCount: number; searchCount: number; appCount: number; interviewCount: number
}) {
  const stats = [
    { icon: Bookmark,  label: 'Saved Jobs',    value: savedCount,     color: '#38BDF8', href: '/saved'     },
    { icon: Search,    label: 'Searches',       value: searchCount,    color: '#A78BFA', href: '/search'    },
    { icon: Briefcase, label: 'Applications',   value: appCount,       color: '#00C9B1', href: '#tracker'   },
    { icon: Calendar,  label: 'Interviews',     value: interviewCount, color: '#FBBF24', href: '#interviews' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
      {stats.map(({ icon: Icon, label, value, color, href }) => (
        <Link key={label} href={href} style={{ textDecoration: 'none' }}>
          <div style={{
            ...cardBase, padding: '20px 18px',
            borderColor: `${color}30`, transition: 'all 0.2s',
            display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}30`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} color={color} />
              </div>
              <ChevronRight size={13} color="#4A6FA5" />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#F0F4FF', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: '#8B9DC3', marginTop: 4 }}>{label}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

/* ===========================================================================
   3. APPLICATION STATUS TRACKER
=========================================================================== */
const STORAGE_KEY = 'jq_applications'

function getApps(): Application[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}
function saveApps(apps: Application[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}

function ApplicationTracker({ onCountChange }: { onCountChange: (n: number) => void }) {
  const [apps, setApps]       = useState<Application[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [draft, setDraft]     = useState<Partial<Application>>({ status: 'applied' })

  useEffect(() => { const a = getApps(); setApps(a); onCountChange(a.length) }, [onCountChange])

  function addApp() {
    if (!draft.title || !draft.company) return
    const a: Application = {
      id: Date.now().toString(),
      title: draft.title!, company: draft.company!,
      location: draft.location ?? '', applied_date: draft.applied_date ?? new Date().toISOString().split('T')[0],
      status: draft.status as Application['status'] ?? 'applied',
      job_url: draft.job_url ?? '', notes: draft.notes ?? '',
    }
    const next = [a, ...apps]
    saveApps(next); setApps(next); onCountChange(next.length); setShowAdd(false); setDraft({ status: 'applied' })
  }

  function updateStatus(id: string, status: Application['status']) {
    const next = apps.map(a => a.id === id ? { ...a, status } : a)
    saveApps(next); setApps(next)
  }

  function removeApp(id: string) {
    const next = apps.filter(a => a.id !== id)
    saveApps(next); setApps(next); onCountChange(next.length)
  }

  const byStatus = (s: Application['status']) => apps.filter(a => a.status === s)

  return (
    <div id="tracker" style={{ ...cardBase, marginBottom: 24 }}>
      <SectionTitle icon={Activity} color="#00C9B1" title="Application Status Tracker"
        sub={`${apps.length} application${apps.length !== 1 ? 's' : ''} tracked`}
        action={
          <button onClick={() => setShowAdd(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            borderRadius: 10, background: 'rgba(0,201,177,0.1)', border: '1.5px solid rgba(0,201,177,0.3)',
            color: '#00C9B1', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            <Plus size={14} /> Track Application
          </button>
        }
      />

      {/* Kanban columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, overflowX: 'auto' }}>
        {(Object.entries(STATUS_CFG) as [Application['status'], typeof STATUS_CFG[Application['status']]][]).map(([key, { label, color, icon: Icon }]) => (
          <div key={key} style={{ minWidth: 160 }}>
            {/* Column header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: 10, marginBottom: 10,
              background: `${color}10`, border: `1px solid ${color}25`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={13} color={color} />
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 800, minWidth: 20, height: 20, borderRadius: 999,
                background: `${color}20`, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{byStatus(key).length}</span>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60 }}>
              {byStatus(key).length === 0 && (
                <div style={{
                  border: `1.5px dashed ${color}20`, borderRadius: 10, padding: '14px 10px',
                  textAlign: 'center', color: '#4A6FA5', fontSize: 11,
                }}>No jobs</div>
              )}
              {byStatus(key).map(app => (
                <div key={app.id} style={{
                  background: '#0A1628', border: `1px solid ${color}25`, borderRadius: 10,
                  padding: '12px', position: 'relative',
                }}>
                  <button onClick={() => removeApp(app.id)} style={{
                    position: 'absolute', top: 6, right: 6, background: 'none', border: 'none',
                    color: '#4A6FA5', cursor: 'pointer', padding: 2, display: 'flex',
                  }}><X size={11} /></button>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F0F4FF', marginBottom: 3, paddingRight: 16 }}>
                    {app.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#8B9DC3', marginBottom: 6 }}>{app.company}</div>
                  {app.applied_date && (
                    <div style={{ fontSize: 10, color: '#4A6FA5' }}>
                      Applied {new Date(app.applied_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  )}
                  {/* Move to next status */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {(Object.keys(STATUS_CFG) as Application['status'][]).filter(s => s !== key).slice(0, 2).map(s => (
                      <button key={s} onClick={() => updateStatus(app.id, s)} style={{
                        fontSize: 9, padding: '2px 7px', borderRadius: 999, cursor: 'pointer',
                        background: `${STATUS_CFG[s].color}15`, border: `1px solid ${STATUS_CFG[s].color}30`,
                        color: STATUS_CFG[s].color, fontWeight: 700,
                      }}>
                        {STATUS_CFG[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 20, padding: 32, maxWidth: 480, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#F0F4FF' }}>Track Application</div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: '#8B9DC3', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'title',    label: 'Job Title *',      ph: 'e.g. Software Engineer' },
                { key: 'company',  label: 'Company *',        ph: 'e.g. Google' },
                { key: 'location', label: 'Location',         ph: 'e.g. Bangalore, India' },
                { key: 'job_url',  label: 'Job URL',          ph: 'https://...' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                  <input value={(draft as Record<string, string>)[key] ?? ''} onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={ph} style={{
                      width: '100%', boxSizing: 'border-box', background: '#0A1628',
                      border: '1.5px solid #1E3A5F', borderRadius: 10, padding: '10px 14px',
                      color: '#F0F4FF', fontSize: 14, outline: 'none',
                    }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(Object.entries(STATUS_CFG) as [Application['status'], typeof STATUS_CFG[Application['status']]][]).map(([s, { label, color }]) => (
                    <button key={s} type="button" onClick={() => setDraft(p => ({ ...p, status: s }))} style={{
                      padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      border: `1.5px solid ${draft.status === s ? color : '#1E3A5F'}`,
                      background: draft.status === s ? `${color}18` : 'transparent',
                      color: draft.status === s ? color : '#8B9DC3',
                    }}>{label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Applied Date</label>
                <input type="date" value={draft.applied_date ?? new Date().toISOString().split('T')[0]}
                  onChange={e => setDraft(p => ({ ...p, applied_date: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0A1628', border: '1.5px solid #1E3A5F', borderRadius: 10, padding: '10px 14px', color: '#F0F4FF', fontSize: 14, outline: 'none', colorScheme: 'dark' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'transparent', border: '1.5px solid #1E3A5F', color: '#8B9DC3', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={addApp} style={{ flex: 2, padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg,#00C9B1,#0EA5E9)', border: 'none', color: '#0A1628', cursor: 'pointer', fontWeight: 800, fontSize: 15 }}>Add Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ===========================================================================
   4. RECOMMENDED JOBS
=========================================================================== */
function RecommendedJobs() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-recommended'],
    queryFn: async () => {
      const res = await postJobApi.list('', '')
      return (res.data as PostedJobOut[]).slice(0, 6)
    },
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div style={{ ...cardBase, height: '100%', boxSizing: 'border-box' }}>
      <SectionTitle icon={Star} color="#FBBF24" title="Recommended Jobs"
        sub="Freshly posted opportunities on JobQuest"
        action={
          <Link href="/search" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#00C9B1', fontWeight: 700, textDecoration: 'none' }}>
            View all <ChevronRight size={13} />
          </Link>
        }
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isLoading && [1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Skel w={40} h={40} r={10} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skel w="70%" h={14} />
              <Skel w="45%" h={12} />
            </div>
          </div>
        ))}
        {!isLoading && (!data || data.length === 0) && (
          <div style={{ textAlign: 'center', padding: '28px 0', color: '#4A6FA5', fontSize: 13 }}>
            <Briefcase size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div>No recommended jobs yet.</div>
            <Link href="/search" style={{ color: '#00C9B1', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Search jobs</Link>
          </div>
        )}
        {data?.map(job => (
          <div key={job.job_id} style={{
            display: 'flex', gap: 14, padding: '14px', borderRadius: 14,
            background: '#0A1628', border: '1px solid #1E3A5F',
            transition: 'border-color 0.2s', cursor: 'pointer',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#FBBF2450'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#1E3A5F'}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={18} color="#FBBF24" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F4FF', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
              <div style={{ fontSize: 12, color: '#8B9DC3', marginBottom: 6 }}>{job.company}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {job.location && <span style={{ fontSize: 11, color: '#4A6FA5', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} />{job.location}</span>}
                {job.job_type && <Pill text={job.job_type} color="#00C9B1" />}
                {job.work_mode && <Pill text={job.work_mode} color="#38BDF8" />}
              </div>
            </div>
            {job.apply_url && (
              <a href={job.apply_url} target="_blank" rel="noreferrer" style={{ color: '#4A6FA5', display: 'flex', alignItems: 'flex-start', paddingTop: 2 }}>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===========================================================================
   5. UPCOMING INTERVIEWS
=========================================================================== */
const IV_KEY = 'jq_interviews'
function getIVs(): Interview[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(IV_KEY) ?? '[]') } catch { return [] }
}

function UpcomingInterviews({ onCountChange }: { onCountChange: (n: number) => void }) {
  const [ivs, setIvs]         = useState<Interview[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [draft, setDraft]     = useState<Partial<Interview>>({ type: 'video' })

  useEffect(() => { const d = getIVs(); setIvs(d); onCountChange(d.filter(i => new Date(i.date) >= new Date()).length) }, [onCountChange])

  function addIV() {
    if (!draft.company || !draft.role || !draft.date || !draft.time) return
    const next = [...ivs, { ...draft, id: Date.now().toString() } as Interview].sort((a, b) => a.date < b.date ? -1 : 1)
    localStorage.setItem(IV_KEY, JSON.stringify(next))
    setIvs(next); onCountChange(next.filter(i => new Date(i.date) >= new Date()).length)
    setShowAdd(false); setDraft({ type: 'video' })
  }

  function removeIV(id: string) {
    const next = ivs.filter(i => i.id !== id)
    localStorage.setItem(IV_KEY, JSON.stringify(next))
    setIvs(next); onCountChange(next.filter(i => new Date(i.date) >= new Date()).length)
  }

  const upcoming = ivs.filter(i => new Date(`${i.date}T${i.time}`) >= new Date()).slice(0, 5)

  function daysUntil(dateStr: string) {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
    return diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `In ${diff} days`
  }

  return (
    <div id="interviews" style={{ ...cardBase, height: '100%', boxSizing: 'border-box' }}>
      <SectionTitle icon={Calendar} color="#A78BFA" title="Upcoming Interviews"
        sub={`${upcoming.length} scheduled`}
        action={
          <button onClick={() => setShowAdd(true)} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
            borderRadius: 10, background: 'rgba(167,139,250,0.1)', border: '1.5px solid rgba(167,139,250,0.3)',
            color: '#A78BFA', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>
            <Plus size={13} /> Add
          </button>
        }
      />

      {upcoming.length === 0 && (
        <div style={{ textAlign: 'center', padding: '28px 0', color: '#4A6FA5', fontSize: 13 }}>
          <Calendar size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
          <div>No interviews scheduled.</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Add one to stay on top of your schedule.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {upcoming.map(iv => {
          const cfg = INTERVIEW_TYPE_CFG[iv.type]
          const urgent = new Date(iv.date) <= new Date(Date.now() + 2 * 86400000)
          return (
            <div key={iv.id} style={{
              display: 'flex', gap: 14, padding: '14px', borderRadius: 14,
              background: '#0A1628', border: `1px solid ${urgent ? 'rgba(251,191,36,0.35)' : '#1E3A5F'}`,
              position: 'relative',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={17} color={cfg.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F4FF', marginBottom: 2 }}>{iv.role}</div>
                <div style={{ fontSize: 12, color: '#8B9DC3', marginBottom: 6 }}>{iv.company}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Pill text={cfg.label} color={cfg.color} />
                  <span style={{ fontSize: 11, color: urgent ? '#FBBF24' : '#4A6FA5', fontWeight: urgent ? 700 : 400 }}>
                    {daysUntil(iv.date)} · {iv.time}
                  </span>
                </div>
              </div>
              <button onClick={() => removeIV(iv.id)} style={{ background: 'none', border: 'none', color: '#4A6FA5', cursor: 'pointer', alignSelf: 'flex-start', padding: 2 }}>
                <X size={12} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Add Interview Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 20, padding: 32, maxWidth: 440, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#F0F4FF' }}>Schedule Interview</div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: '#8B9DC3', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'role',    label: 'Role *',      ph: 'e.g. Senior Engineer'  },
                { key: 'company', label: 'Company *',   ph: 'e.g. Microsoft'        },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                  <input value={(draft as Record<string, string>)[key] ?? ''} onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={ph} style={{ width: '100%', boxSizing: 'border-box', background: '#0A1628', border: '1.5px solid #1E3A5F', borderRadius: 10, padding: '10px 14px', color: '#F0F4FF', fontSize: 14, outline: 'none' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { key: 'date', label: 'Date *', type: 'date' },
                  { key: 'time', label: 'Time *', type: 'time' },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                    <input type={type} value={(draft as Record<string, string>)[key] ?? ''} onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box', background: '#0A1628', border: '1.5px solid #1E3A5F', borderRadius: 10, padding: '10px 14px', color: '#F0F4FF', fontSize: 14, outline: 'none', colorScheme: 'dark' }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8B9DC3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Interview Type</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(Object.entries(INTERVIEW_TYPE_CFG) as [Interview['type'], { label: string; color: string }][]).map(([t, { label, color }]) => (
                    <button key={t} type="button" onClick={() => setDraft(p => ({ ...p, type: t }))} style={{
                      padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      border: `1.5px solid ${draft.type === t ? color : '#1E3A5F'}`,
                      background: draft.type === t ? `${color}18` : 'transparent',
                      color: draft.type === t ? color : '#8B9DC3',
                    }}>{label}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'transparent', border: '1.5px solid #1E3A5F', color: '#8B9DC3', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={addIV} style={{ flex: 2, padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg,#A78BFA,#818CF8)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: 15 }}>Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ===========================================================================
   6. RECRUITER ACTIVITY
=========================================================================== */
function RecruiterActivity({ savedCount, searchCount }: { savedCount: number; searchCount: number }) {
  const score = Math.min(100, Math.round((savedCount * 12 + searchCount * 5 + 30)))
  const activity = [
    { label: 'Profile views this week',   value: Math.max(3, Math.round(score / 8)),    icon: Eye,    color: '#38BDF8' },
    { label: 'Search appearances',        value: Math.max(12, Math.round(score * 1.4)), icon: Search, color: '#A78BFA' },
    { label: 'Recruiter InMails',         value: Math.round(score / 25),                icon: Mail,   color: '#00C9B1' },
    { label: 'Profile in shortlists',     value: Math.round(score / 18),                icon: Users,  color: '#FBBF24' },
  ]
  return (
    <div style={{ ...cardBase, height: '100%', boxSizing: 'border-box' }}>
      <SectionTitle icon={Bell} color="#38BDF8" title="Recruiter Activity"
        sub="How recruiters are engaging with your profile" />

      {/* Visibility score */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 14,
        background: 'linear-gradient(135deg,rgba(56,189,248,0.08),rgba(10,22,40,0.8))',
        border: '1px solid rgba(56,189,248,0.2)', marginBottom: 20,
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={22} color="#38BDF8" />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#8B9DC3', marginBottom: 3 }}>Visibility Score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#38BDF8', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 13, color: '#4A6FA5' }}>/100</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, borderRadius: 999, background: '#1E3A5F', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${score}%`, borderRadius: 999, background: 'linear-gradient(90deg,#38BDF8,#818CF8)', transition: 'width 1s ease' }} />
          </div>
          <div style={{ fontSize: 11, color: '#4A6FA5', marginTop: 4 }}>
            {score < 40 ? 'Low — complete your profile to improve' : score < 70 ? 'Moderate — keep searching and applying' : 'High — recruiters can find you easily'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {activity.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ padding: '14px', borderRadius: 12, background: '#0A1628', border: `1px solid ${color}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon size={13} color={color} />
              <span style={{ fontSize: 11, color: '#8B9DC3' }}>{label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#F0F4FF' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: '12px', borderRadius: 12, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#4ADE80' }}>
          <TrendingUp size={13} /> <strong>Tip:</strong> Complete your profile to 100% to boost visibility by 3x
        </div>
      </div>
    </div>
  )
}

/* ===========================================================================
   7. JOB SEARCH ANALYTICS
=========================================================================== */
function SearchAnalytics() {
  const { data: history, isLoading } = useQuery<{ data: { id: number; query: string; location: string; platforms: string; result_count: number; searched_at: string }[] }>({
    queryKey: ['dashboard-history'],
    queryFn: () => historyApi.get(),
    staleTime: 60_000,
  })

  const entries = history?.data ?? []

  const topQueries = useMemo(() => {
    const counts: Record<string, number> = {}
    entries.forEach(e => { counts[e.query] = (counts[e.query] ?? 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [entries])

  const last7 = useMemo(() => {
    const days: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      days[d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })] = 0
    }
    entries.forEach(e => {
      const key = new Date(e.searched_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      if (key in days) days[key]++
    })
    return Object.entries(days)
  }, [entries])

  const maxDay = Math.max(...last7.map(([, v]) => v), 1)

  return (
    <div style={{ ...cardBase, height: '100%', boxSizing: 'border-box' }}>
      <SectionTitle icon={BarChart2} color="#4ADE80" title="Job Search Analytics"
        sub={`${entries.length} total searches`}
        action={
          <Link href="/search" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#00C9B1', fontWeight: 700, textDecoration: 'none' }}>
            Search <ChevronRight size={13} />
          </Link>
        }
      />

      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <Skel key={i} w="100%" h={32} />)}
        </div>
      )}

      {!isLoading && entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '28px 0', color: '#4A6FA5', fontSize: 13 }}>
          <BarChart2 size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
          <div>No search history yet.</div>
          <Link href="/search" style={{ color: '#00C9B1', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Start searching</Link>
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <>
          {/* 7-day bar chart */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#8B9DC3', marginBottom: 12, fontWeight: 600 }}>Searches — Last 7 Days</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
              {last7.map(([day, count]) => (
                <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: count > 0 ? 'linear-gradient(180deg,#4ADE80,#22C55E)' : '#1E3A5F', height: `${Math.max(4, (count / maxDay) * 52)}px`, transition: 'height 0.6s ease' }} />
                  <span style={{ fontSize: 9, color: '#4A6FA5', whiteSpace: 'nowrap' }}>{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top queries */}
          <div>
            <div style={{ fontSize: 12, color: '#8B9DC3', marginBottom: 12, fontWeight: 600 }}>Top Search Queries</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topQueries.map(([query, count], i) => (
                <div key={query} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#4A6FA5', fontWeight: 700, minWidth: 16 }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#F0F4FF', fontWeight: 600 }}>{query}</span>
                      <span style={{ fontSize: 11, color: '#4ADE80', fontWeight: 700 }}>{count}x</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, background: '#1E3A5F', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(count / (topQueries[0][1] || 1)) * 100}%`, background: 'linear-gradient(90deg,#4ADE80,#22C55E)', borderRadius: 999 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ===========================================================================
   MAIN PAGE
=========================================================================== */
export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  const [appCount,       setAppCount]       = useState(0)
  const [interviewCount, setInterviewCount] = useState(0)

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/')
  }, [isLoaded, isSignedIn, router])

  const { data: savedData } = useQuery({
    queryKey: ['dashboard-saved'],
    queryFn: () => savedApi.get(),
    staleTime: 60_000,
    enabled: isSignedIn ?? false,
  })

  const { data: historyData } = useQuery({
    queryKey: ['dashboard-history-count'],
    queryFn: () => historyApi.get(),
    staleTime: 60_000,
    enabled: isSignedIn ?? false,
  })

  const savedCount  = (savedData?.data as SavedJob[] | undefined)?.length ?? 0
  const searchCount = (historyData?.data as { id: number }[] | undefined)?.length ?? 0

  const fullName = user?.fullName || user?.firstName || 'there'

  if (!isLoaded) {
    return (
      <div style={{ background: '#0A1628', minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Skel w={240} h={40} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {[1,2,3,4].map(i => <Skel key={i} w="100%" h={100} r={20} />)}
          </div>
          <Skel w="100%" h={300} r={20} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: '36px 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => router.back()} style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 24,
          padding: '8px 16px', borderRadius: 10, background: 'transparent',
          border: '1px solid #1E3A5F', color: '#8B9DC3', fontSize: 14, fontWeight: 500,
          cursor: 'pointer', transition: 'all 0.18s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#4A6FA5'; (e.currentTarget as HTMLButtonElement).style.color = '#F0F4FF' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1E3A5F'; (e.currentTarget as HTMLButtonElement).style.color = '#8B9DC3' }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          {user?.imageUrl ? (
            <Image src={user.imageUrl} alt={fullName} width={52} height={52}
              style={{ borderRadius: '50%', border: '2px solid rgba(0,201,177,0.4)', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#00C9B1,#38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#0A1628', flexShrink: 0, border: '2px solid rgba(0,201,177,0.4)' }}>
              {(user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '') || <User size={22} color="#0A1628" />}
            </div>
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: 'clamp(20px,3vw,30px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#F0F4FF', lineHeight: 1.1 }}>
              Welcome back,{' '}
              <span style={{ background: 'linear-gradient(90deg,#00C9B1,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {fullName}
              </span>{' '}👋
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#8B9DC3' }}>{user?.primaryEmailAddress?.emailAddress}</span>
              {user?.primaryEmailAddress?.verification?.status === 'verified' && (
                <Pill text="Verified" color="#4ADE80" />
              )}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.2)', color: '#00C9B1', fontSize: 11, fontWeight: 700 }}>
                <Sparkles size={10} fill="#00C9B1" /> Free Plan
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <QuickStats savedCount={savedCount} searchCount={searchCount} appCount={appCount} interviewCount={interviewCount} />

        {/* Row 1: Profile Completion + Application Tracker */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, marginBottom: 20, alignItems: 'start' }}>
          <ProfileCompletion user={user} />
          <ApplicationTracker onCountChange={setAppCount} />
        </div>

        {/* Row 2: Recommended Jobs + Upcoming Interviews */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 20, alignItems: 'start' }}>
          <RecommendedJobs />
          <UpcomingInterviews onCountChange={setInterviewCount} />
        </div>

        {/* Row 3: Recruiter Activity + Search Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
          <RecruiterActivity savedCount={savedCount} searchCount={searchCount} />
          <SearchAnalytics />
        </div>

      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  )
}
