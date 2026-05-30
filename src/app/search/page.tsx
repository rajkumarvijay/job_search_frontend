import { Suspense } from 'react'
import { SearchPageClient } from '@/components/search/SearchPageClient'

// Spinner shown while JS loads
function SearchLoading() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #1E3A5F',
        borderTopColor: '#00C9B1',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#8B9DC3', fontSize: 14 }}>Loading search…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Server component — wraps the client search in Suspense
// This is required by Next.js App Router for useSearchParams() to work
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchPageClient />
    </Suspense>
  )
}
