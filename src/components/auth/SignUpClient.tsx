'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Briefcase, ArrowRight } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'
import type { TokenResponse } from '@/types'

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['#EF4444', '#FBBF24', '#38BDF8', '#00C9B1']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  if (!password) return null
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 999,
            background: i < score ? colors[score - 1] : '#1E3A5F',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: score > 0 ? colors[score - 1] : '#4A6FA5' }}>
        {score > 0 ? labels[score - 1] : ''}
      </span>
    </div>
  )
}

export function SignUpClient() {
  const router  = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [showCfm,  setShowCfm]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [focused,  setFocused]  = useState('')

  const inp = (field: string): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box',
    background: '#0A1628',
    border: `1.5px solid ${focused === field ? '#00C9B1' : '#1E3A5F'}`,
    borderRadius: 10, padding: '13px 16px 13px 44px',
    color: '#F0F4FF', fontSize: 15, outline: 'none', transition: 'border-color 0.2s',
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim())   return setError('Please enter your name.')
    if (!email.trim())  return setError('Please enter your email.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm)  return setError('Passwords do not match.')

    setLoading(true)
    try {
      const { data } = await authApi.signup({ name: name.trim(), email: email.trim(), password })
      const res = data as TokenResponse
      setAuth(res.user, res.access_token)
      router.push('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? 'Sign up failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const passwordsMatch = confirm && password === confirm

  return (
    <div style={{
      minHeight: '100vh', background: '#0A1628',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: '#00C9B1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0,201,177,0.4)',
            }}>
              <Briefcase size={20} color="#0A1628" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF', letterSpacing: '-0.02em' }}>
              Job<span style={{ color: '#00C9B1' }}>Quest</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F0F4FF', margin: '24px 0 6px' }}>
            Create your account
          </h1>
          <p style={{ color: '#8B9DC3', fontSize: 14 }}>
            Free forever · No credit card required
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#0F2044', border: '1px solid #1E3A5F',
          borderRadius: 20, padding: '36px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8B9DC3', marginBottom: 8 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#4A6FA5" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text" value={name} required autoComplete="name"
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="Your full name"
                  style={inp('name')}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8B9DC3', marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#4A6FA5" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email" value={email} required autoComplete="email"
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="you@example.com"
                  style={inp('email')}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8B9DC3', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#4A6FA5" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPwd ? 'text' : 'password'} value={password} required autoComplete="new-password"
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  placeholder="Min 8 characters"
                  style={{ ...inp('password'), paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#4A6FA5', padding: 0,
                }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <StrengthBar password={password} />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#8B9DC3', marginBottom: 8 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#4A6FA5" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showCfm ? 'text' : 'password'} value={confirm} required autoComplete="new-password"
                  onChange={e => setConfirm(e.target.value)}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
                  placeholder="Re-enter your password"
                  style={{
                    ...inp('confirm'), paddingRight: 44,
                    borderColor: confirm ? (passwordsMatch ? '#00C9B1' : '#EF4444') : (focused === 'confirm' ? '#00C9B1' : '#1E3A5F'),
                  }}
                />
                <button type="button" onClick={() => setShowCfm(p => !p)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#4A6FA5', padding: 0,
                }}>
                  {showCfm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {confirm && (
                  <div style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }}>
                    {passwordsMatch
                      ? <CheckCircle2 size={14} color="#00C9B1" />
                      : <AlertCircle size={14} color="#EF4444" />}
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                borderRadius: 10, margin: '16px 0',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#FCA5A5', fontSize: 13,
              }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 12, marginTop: 20,
              fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'wait' : 'pointer',
              background: loading ? 'rgba(0,201,177,0.4)' : 'linear-gradient(135deg, #00C9B1, #0EA5E9)',
              color: '#0A1628',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(0,201,177,0.25)', transition: 'all 0.2s',
            }}>
              {loading ? (
                <><span style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid #0A162840', borderTopColor: '#0A1628',
                  animation: 'spin 0.7s linear infinite', display: 'inline-block',
                }} /> Creating account…</>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: '#4A6FA5', marginTop: 14 }}>
              By signing up you agree to our Terms of Service.
            </p>

          </form>
        </div>

        {/* Footer link */}
        <p style={{ textAlign: 'center', marginTop: 24, color: '#8B9DC3', fontSize: 14 }}>
          Already have an account?{' '}
          <Link href="/signin" style={{ color: '#00C9B1', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
