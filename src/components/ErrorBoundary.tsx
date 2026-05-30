'use client'

import React from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface State { hasError: boolean; message: string }

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message ?? 'Unknown error' }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '80px 24px', textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, marginBottom: 20,
            background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={28} color="#FBBF24" />
          </div>

          <h2 style={{ fontWeight: 800, fontSize: 20, color: '#F0F4FF', marginBottom: 10 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: 14, color: '#8B9DC3', marginBottom: 6, maxWidth: 360 }}>
            A rendering error occurred. This is usually caused by unexpected data from the search results.
          </p>
          <p style={{
            fontSize: 11, color: 'rgba(251,191,36,0.5)', marginBottom: 28,
            fontFamily: 'monospace', maxWidth: 400, wordBreak: 'break-all',
          }}>
            {this.state.message}
          </p>

          <button
            onClick={() => {
              this.setState({ hasError: false, message: '' })
              window.location.reload()
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10,
              background: '#00C9B1', color: '#0A1628',
              fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} />
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
