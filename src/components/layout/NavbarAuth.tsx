'use client'

/**
 * NavbarAuth — auth section of the navbar (loaded client-side only via
 * next/dynamic({ ssr: false }) in Navbar.tsx).
 *
 * GoogleOAuthProvider is always present in the tree (see Providers.tsx) so
 * useGoogleLogin never throws a missing-context error.
 * When NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured we simply hide the
 * Google button — the rest of the auth UI (email sign-in / sign-up) still works.
 */

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, LogIn, UserPlus, LogOut, Mail, AlertCircle } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuthStore } from '@/store/useAuthStore'
import { authApi } from '@/lib/api'
import type { TokenResponse } from '@/types'

/** True only when the Google client ID is baked into the bundle at build time */
const GOOGLE_ENABLED =
  !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== '__missing__'

/* ── shared panel style ──────────────────────────────────────────────────── */
function panelStyle(minW: number): React.CSSProperties {
  return {
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    minWidth: minW, borderRadius: 16,
    background: 'rgba(10,22,40,0.97)', border: '1px solid #1E3A5F',
    boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,201,177,0.06)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    overflow: 'hidden', zIndex: 200, animation: 'dropIn 0.18s ease',
  }
}

/* ══════════════════════════════════════════════════════
   GOOGLE LOGIN BUTTON
   Isolated so useGoogleLogin is only called when this
   component is actually rendered (Google is configured).
══════════════════════════════════════════════════════ */
function GoogleLoginButton({
  onSuccess,
  onError,
  loading,
}: {
  onSuccess: (t: { access_token: string }) => void
  onError:   () => void
  loading:   boolean
}) {
  const googleLogin = useGoogleLogin({ onSuccess, onError })

  return (
    <button
      onClick={() => googleLogin()}
      disabled={loading}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '11px 16px', borderRadius: 10, cursor: loading ? 'wait' : 'pointer',
        background: '#fff', border: '1.5px solid #e0e0e0',
        fontSize: 14, fontWeight: 600, color: '#1a1a1a',
        transition: 'all 0.18s', marginBottom: 4,
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        opacity: loading ? 0.7 : 1,
      }}
      onMouseEnter={e => !loading && ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)')}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.15)')}
    >
      {loading ? (
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          border: '2px solid #ccc', borderTopColor: '#1a1a1a',
          animation: 'spin 0.7s linear infinite', display: 'inline-block',
        }} />
      ) : (
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
      )}
      {loading ? 'Signing in…' : 'Continue with Google'}
    </button>
  )
}

/* ══════════════════════════════════════════════════════
   AUTH DROPDOWN  (combined Sign In / Sign Up / Google)
══════════════════════════════════════════════════════ */
function AuthDropdown() {
  const setAuth = useAuthStore(s => s.setAuth)
  const [open, setOpen]           = useState(false)
  const [googleErr, setGoogleErr] = useState('')
  const [loading, setLoading]     = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleGoogleSuccess = async (tokenResponse: { access_token: string }) => {
    setGoogleErr(''); setLoading(true)
    try {
      const { data } = await authApi.googleAuth({ access_token: tokenResponse.access_token })
      const res = data as TokenResponse
      setAuth(res.user, res.access_token)
      setOpen(false)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        ?? 'Google sign-in failed. Try again.'
      setGoogleErr(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => { setOpen(o => !o); setGoogleErr('') }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.18s', border: '1px solid #1E3A5F',
          background: 'transparent', color: '#8B9DC3',
        }}
      >
        <LogIn size={15} />
        <span>Sign In</span>
        <ChevronDown
          size={13}
          style={{ marginLeft: 2, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div style={{ ...panelStyle(300), padding: '20px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#F0F4FF', marginBottom: 4 }}>
              Welcome to JobQuest
            </div>
            <div style={{ fontSize: 12, color: '#4A6FA5' }}>
              Sign in to save jobs, track history &amp; more
            </div>
          </div>

          {/* Google button — only rendered when client ID is configured */}
          {GOOGLE_ENABLED && (
            <>
              <GoogleLoginButton
                onSuccess={handleGoogleSuccess}
                onError={() => setGoogleErr('Google sign-in was cancelled or failed.')}
                loading={loading}
              />
              {googleErr && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 12px', borderRadius: 8, marginBottom: 4,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                  color: '#FCA5A5', fontSize: 12,
                }}>
                  <AlertCircle size={12} />{googleErr}
                </div>
              )}

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#1E3A5F' }} />
                <span style={{ fontSize: 11, color: '#4A6FA5', fontWeight: 600, letterSpacing: '0.08em' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: '#1E3A5F' }} />
              </div>
            </>
          )}

          {/* Email sign-in */}
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 16px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(0,201,177,0.08)', border: '1.5px solid rgba(0,201,177,0.25)',
              color: '#00C9B1', fontSize: 14, fontWeight: 600,
              transition: 'all 0.18s', marginBottom: 10, boxSizing: 'border-box',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,201,177,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,201,177,0.08)')}
          >
            <Mail size={15} /> Sign in with Email
          </Link>

          {/* Create account */}
          <div style={{ textAlign: 'center', fontSize: 13, color: '#8B9DC3' }}>
            New here?{' '}
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              style={{ color: '#00C9B1', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <UserPlus size={13} /> Create account
            </Link>
          </div>

        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   USER MENU  (logged-in state)
══════════════════════════════════════════════════════ */
function UserMenu() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  if (!user) return null

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 12px 5px 5px', borderRadius: 999,
          background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.2)',
          cursor: 'pointer', transition: 'all 0.18s',
        }}
      >
        {user.avatar_url ? (
          <Image
            src={user.avatar_url} alt={user.name}
            width={30} height={30}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00C9B1, #0EA5E9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#0A1628', flexShrink: 0,
          }}>
            {initials}
          </div>
        )}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#F0F4FF', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown size={12} color="#8B9DC3" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div style={panelStyle(210)}>
          {/* User info */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1E3A5F' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt={user.name} width={36} height={36}
                  style={{ borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00C9B1, #0EA5E9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: '#0A1628',
                }}>
                  {initials}
                </div>
              )}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F0F4FF' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: '#4A6FA5', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>
                  {user.email}
                </div>
              </div>
            </div>
            {/* Auth provider badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
              background: user.auth_provider === 'google' ? 'rgba(234,67,53,0.1)' : 'rgba(0,201,177,0.1)',
              color: user.auth_provider === 'google' ? '#EA4335' : '#00C9B1',
              border: `1px solid ${user.auth_provider === 'google' ? 'rgba(234,67,53,0.25)' : 'rgba(0,201,177,0.25)'}`,
            }}>
              {user.auth_provider === 'google' ? (
                <svg width="10" height="10" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              ) : '✉'}
              {user.auth_provider === 'google' ? 'Google account' : 'Email account'}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={() => { clearAuth(); setOpen(false); router.push('/') }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', background: 'transparent', border: 'none',
              color: '#FCA5A5', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              transition: 'background 0.15s', textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={15} />Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   DEFAULT EXPORT — rendered by dynamic() in Navbar
══════════════════════════════════════════════════════ */
export default function NavbarAuth() {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return <div style={{ width: 88, height: 36 }} />
  }

  return user ? <UserMenu /> : <AuthDropdown />
}
