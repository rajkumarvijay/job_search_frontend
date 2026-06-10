'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { SearchBar } from './SearchBar'
import { JobGrid } from './JobGrid'
import { FilterSidebar } from './FilterSidebar'
import { SourceBadge } from './SourceBadge'
import { useJobSearch } from '@/hooks/useJobSearch'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Search } from 'lucide-react'

function FilterLoading() {
  return (
    <div style={{
      background: '#0F2044', border: '1px solid #1E3A5F',
      borderRadius: 16, padding: 20, width: '100%', height: 300,
      animation: 'pulse 2s ease-in-out infinite',
    }} />
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const q         = searchParams.get('q')        ?? ''
  const location  = searchParams.get('location') ?? 'India'
  const platforms = searchParams.get('platforms') ?? 'all'
  const { addEntry } = useSearchHistory()

  const { data, isLoading, error } = useJobSearch(
    { q, location, platforms, results_per_site: 10 },
    !!q,
  )

  useEffect(() => {
    if (data && q) addEntry(q, location, data.total)
  }, [data?.total, q]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

      {/* Search bar */}
      <div style={{ marginBottom: 32 }}>
        <SearchBar defaultQuery={q} defaultLocation={location} />
      </div>

      {/* Results summary */}
      {q && !isLoading && data && data.total > 0 && (
        <div style={{
          marginBottom: 24, display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', gap: 12,
        }}>
          <p style={{ fontWeight: 700, fontSize: 16, color: '#F0F4FF', margin: 0 }}>
            <span style={{ color: '#00C9B1' }}>{data.total.toLocaleString('en-IN')}</span>
            {' '}jobs for &ldquo;{q}&rdquo;
            {location !== 'India' && (
              <span style={{ color: '#8B9DC3', fontWeight: 400 }}> in {location}</span>
            )}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.platforms_searched.map(p => <SourceBadge key={p} platform={p} />)}
          </div>

          {data.cached && (
            <span style={{
              fontSize: 11, color: '#8B9DC3', padding: '2px 8px',
              borderRadius: 5, background: '#0F2044', border: '1px solid #1E3A5F',
            }}>
              cached
            </span>
          )}
        </div>
      )}

      {/* Main layout */}
      <div className="search-layout">

        {/* Filter sidebar */}
        <aside className="search-sidebar">
          <Suspense fallback={<FilterLoading />}>
            <FilterSidebar />
          </Suspense>
        </aside>

        {/* Job results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!q ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '80px 0', textAlign: 'center',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18, marginBottom: 20,
                background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Search size={28} color="#00C9B1" />
              </div>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: '#F0F4FF', marginBottom: 8 }}>
                Search for your next role
              </h2>
              <p style={{ fontSize: 14, color: '#8B9DC3', maxWidth: 280 }}>
                Enter a job title, skill, or keyword above to search across 6 job portals simultaneously.
              </p>
            </div>
          ) : (
            <JobGrid
              jobs={data?.jobs ?? []}
              isLoading={isLoading}
              error={error as Error | null}
              query={q}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Exported component — wraps everything in ErrorBoundary + Suspense
export function SearchPageClient() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchContent />
      </Suspense>
    </ErrorBoundary>
  )
}

function SearchSkeleton() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ height: 56, borderRadius: 16, background: '#0F2044', border: '1px solid #1E3A5F', marginBottom: 32 }} />
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 240, height: 400, borderRadius: 16, background: '#0F2044', border: '1px solid #1E3A5F', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{ height: 180, borderRadius: 16, background: '#0F2044', border: '1px solid #1E3A5F' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
