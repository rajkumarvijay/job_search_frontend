'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Check, Sparkles, Loader2, CheckCircle2, X, Shield } from 'lucide-react'
import { paymentApi } from '@/lib/api'
import { useRazorpay } from '@/hooks/useRazorpay'
import { useSubscription } from '@/hooks/useSubscription'
import { useQuery } from '@tanstack/react-query'

interface Plan {
  code: string
  name: string
  price: number
  price_label: string
  period: string
  product_key: string | null
  features: string[]
  cta: string
  highlight: boolean
}

export default function PricingPage() {
  const qc = useQueryClient()
  const { checkout, status, error, reset } = useRazorpay()
  const { data: sub } = useSubscription()
  const [activeProduct, setActiveProduct] = useState<string | null>(null)

  const { data: plansData, isLoading } = useQuery<{ plans: Plan[] }>({
    queryKey: ['plans'],
    queryFn: async () => (await paymentApi.plans()).data,
    staleTime: 5 * 60 * 1000,
  })

  const plans = plansData?.plans ?? []
  const currentPlan = sub?.plan_code ?? 'free'

  const handleUpgrade = (plan: Plan) => {
    if (!plan.product_key) return
    setActiveProduct(plan.product_key)
    checkout(plan.product_key, () => {
      qc.invalidateQueries({ queryKey: ['subscription'] })
    })
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 18px', borderRadius: 999, marginBottom: 20,
          background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)',
          color: '#00C9B1', fontSize: 13, fontWeight: 600,
        }}>
          <Sparkles size={13} fill="#00C9B1" />
          Simple, transparent pricing
        </div>
        <h1 style={{
          fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#F0F4FF',
          letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.1,
        }}>
          Find your dream job, <span className="text-grad">faster</span>
        </h1>
        <p style={{ fontSize: 18, color: '#8B9DC3', maxWidth: 520, margin: '0 auto' }}>
          Upgrade for unlimited AI-powered search and resume scoring. Cancel anytime.
        </p>
      </div>

      {/* Plans */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: 480, borderRadius: 20, background: '#0F2044', border: '1px solid #1E3A5F' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, alignItems: 'start' }}>
          {plans.map(plan => {
            const isCurrent = plan.code === currentPlan
            const isProcessing = activeProduct === plan.product_key && (status === 'loading' || status === 'processing')

            return (
              <div key={plan.code} style={{
                position: 'relative',
                background: plan.highlight ? 'linear-gradient(160deg, rgba(0,201,177,0.08), #0F2044 60%)' : '#0F2044',
                border: `1.5px solid ${plan.highlight ? 'rgba(0,201,177,0.4)' : '#1E3A5F'}`,
                borderRadius: 20, padding: 32,
                boxShadow: plan.highlight ? '0 12px 48px rgba(0,201,177,0.12)' : 'none',
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 14px', borderRadius: 999, background: '#00C9B1',
                    color: '#0A1628', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em',
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ fontSize: 14, fontWeight: 700, color: '#8B9DC3', marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: '#F0F4FF', letterSpacing: '-0.02em' }}>{plan.price_label}</span>
                  <span style={{ fontSize: 14, color: '#8B9DC3' }}>/ {plan.period}</span>
                </div>

                <div style={{ height: 1, background: '#1E3A5F', margin: '24px 0' }} />

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#F0F4FF' }}>
                      <Check size={16} color="#00C9B1" style={{ flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrent || !plan.product_key || isProcessing}
                  onClick={() => handleUpgrade(plan)}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: isCurrent || !plan.product_key ? 'default' : 'pointer',
                    border: 'none', transition: 'all 0.18s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: isCurrent ? 'rgba(30,58,95,0.6)' : plan.highlight ? '#00C9B1' : 'transparent',
                    color: isCurrent ? '#8B9DC3' : plan.highlight ? '#0A1628' : '#00C9B1',
                    outline: !plan.highlight && !isCurrent ? '1px solid #1E3A5F' : 'none',
                    opacity: isProcessing ? 0.7 : 1,
                  }}
                >
                  {isProcessing && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
                  {isCurrent ? 'Current Plan' : isProcessing ? 'Processing…' : plan.cta}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Trust footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40, color: '#8B9DC3', fontSize: 13 }}>
        <Shield size={14} color="#00C9B1" />
        Secure payments via Razorpay · UPI · Cards · Net Banking · Wallets
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Success modal */}
      {status === 'success' && (
        <Overlay onClose={reset}>
          <CheckCircle2 size={56} color="#4ADE80" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF', marginBottom: 8 }}>Payment Successful!</h2>
          <p style={{ fontSize: 14, color: '#8B9DC3', marginBottom: 24 }}>
            Your plan is now active. Enjoy unlimited AI-powered job search.
          </p>
          <button onClick={reset} className="jq-btn" style={{ width: '100%', justifyContent: 'center' }}>
            Start Searching
          </button>
        </Overlay>
      )}

      {/* Error modal */}
      {status === 'error' && (
        <Overlay onClose={reset}>
          <X size={56} color="#F87171" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F0F4FF', marginBottom: 8 }}>Payment Failed</h2>
          <p style={{ fontSize: 14, color: '#8B9DC3', marginBottom: 24 }}>{error}</p>
          <button onClick={reset} className="jq-btn" style={{ width: '100%', justifyContent: 'center' }}>
            Try Again
          </button>
        </Overlay>
      )}
    </div>
  )
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div style={{
        background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 20,
        padding: 36, maxWidth: 380, width: '100%', textAlign: 'center',
      }}>
        {children}
      </div>
    </div>
  )
}
