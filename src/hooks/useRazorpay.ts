'use client'

import { useCallback, useState } from 'react'
import { paymentApi } from '@/lib/api'

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void }
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Simple UUID for idempotency keys
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

type Status = 'idle' | 'loading' | 'processing' | 'success' | 'error'

export function useRazorpay() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string>('')

  const checkout = useCallback(async (productKey: string, onSuccess?: (plan?: string) => void) => {
    setStatus('loading')
    setError('')

    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Failed to load payment gateway. Check your connection.')

      // 2. Create order server-side (price is server-authoritative)
      const idempotencyKey = uuid()
      const { data: order } = await paymentApi.createOrder(productKey, idempotencyKey)

      // 3. Open Razorpay Checkout
      setStatus('processing')
      const rzp = new window.Razorpay!({
        key: order.razorpay_key_id,
        amount: order.amount,
        currency: order.currency,
        name: order.name,
        description: order.description,
        order_id: order.razorpay_order_id,
        theme: { color: '#00C9B1' },
        handler: async (response: RazorpayResponse) => {
          try {
            // 4. Verify signature server-side before granting access
            const { data } = await paymentApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            if (data.success) {
              setStatus('success')
              onSuccess?.(data.plan_code)
            } else {
              throw new Error(data.message || 'Verification failed')
            }
          } catch (e: unknown) {
            setStatus('error')
            setError(extractError(e))
          }
        },
        modal: {
          ondismiss: () => setStatus((s) => (s === 'processing' ? 'idle' : s)),
        },
      })
      rzp.open()
    } catch (e: unknown) {
      setStatus('error')
      setError(extractError(e))
    }
  }, [])

  return { checkout, status, error, reset: () => { setStatus('idle'); setError('') } }
}

function extractError(e: unknown): string {
  if (e && typeof e === 'object') {
    const ax = e as { response?: { data?: { detail?: string } }; message?: string }
    return ax.response?.data?.detail || ax.message || 'Payment failed'
  }
  return 'Payment failed'
}
