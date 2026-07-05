'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense, useState } from 'react'
import { SearchBar } from './SearchBar'
import { JobGrid } from './JobGrid'
import { FilterSidebar } from './FilterSidebar'
import { SourceBadge } from './SourceBadge'
import { useJobSearch } from '@/hooks/useJobSearch'
import { useSemanticSearch } from '@/hooks/useSemanticSearch'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Search, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react'

const SMART_PAGE_SIZE = 10

function FilterLoading() {
  return (
    <div style={{
      background: '#0F2044', border: '1px solid #1E3A5F',
      borderRadius: 16, padding: 20, width: '100%', height: 300,
      animation: 'pulse 2s ease-in-out infinite',
    }} />
  )
}

function SearchModeToggle({
  mode, onChange,
}: { mode: 'keyword' | 'smart'; onChange: (m: 'keyword' | 'smart') => void }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#0F2044', border: '1px solid #1E3A5F',
      borderRadius: 12, padding: 4,
    }}>
      <button
        onClick={() => onChange('keyword')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, transition: 'all 0.18s',
          background: mode === 'keyword' ? '#1E3A5F' : 'transparent',
          color: mode === 'keyword' ? '#F0F4FF' : '#4A6FA5',
        }}
      >
        <Search size={13} /> Keyword
      </button>
      <button
        onClick={() => onChange('smart')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, transition: 'all 0.18s',
          background: mode === 'smart' ? 'rgba(0,201,177,0.12)' : 'transparent',
          color: mode === 'smart' ? '#00C9B1' : '#4A6FA5',
          boxShadow: mode === 'smart' ? '0 0 0 1px rgba(0,201,177,0.3)' : 'none',
        }}
      >
        <Sparkles size={13} /> Smart Search
      </button>
    </div>
  )
}

function SearchContent() {
  const searchParams          = useSearchParams()
  const q                     = searchParams.get('q')        ?? ''
  const location              = searchParams.get('location') ?? 'India'
  const platforms             = searchParams.get('platforms') ?? 'all'
  const { addEntry }          = useSearchHistory()
  const [mode, setMode]       = useState<'keyword' | 'smart'>('keyword')
  const [smartPage, setSmartPage] = useState(1)

  // Reset smart page when query or mode changes
  useEffect(() => { setSmartPage(1) }, [q, mode])

  const keywordSearch = useJobSearch(
    { q, location, platforms, results_per_site: 10 },
    mode === 'keyword' && !!q,
  )

  const smartSearch = useSemanticSearch(
    { q, location, limit: 30 },
    mode === 'smart' && !!q,
  )

  const data      = mode === 'keyword' ? keywordSearch.data      : smartSearch.data
  const isLoading = mode === 'keyword' ? keywordSearch.isLoading : smartSearch.isLoading
  const error     = mode === 'keyword' ? keywordSearch.error     : smartSearch.error

  const allJobs = data?.jobs ?? []
  const total   = data?.total ?? 0

  // For smart mode: paginate client-side. Keyword mode shows all (has its own pagination).
  const smartTotalPages = Math.ceil(allJobs.length / SMART_PAGE_SIZE)
  const jobs = mode === 'smart'
    ? allJobs.slice((smartPage - 1) * SMART_PAGE_SIZE, smartPage * SMART_PAGE_SIZE)
    : allJobs

  useEffect(() => {
    if (data && q) addEntry(q, location, total)
  }, [total, q]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

      {/* Search bar */}
      <div style={{ marginBottom: 20 }}>
        <SearchBar defaultQuery={q} defaultLocation={location} />
      </div>

      {/* Mode toggle + hint */}
      <div style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <SearchModeToggle mode={mode} onChange={setMode} />
        {mode === 'smart' && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: '#00C9B1', fontWeight: 600,
          }}>
            <Zap size={12} />
            Try: &ldquo;remote python work&rdquo; · &ldquo;finance role in bangalore&rdquo; · &ldquo;I&apos;m good at data&rdquo;
          </span>
        )}
      </div>

      {/* Results summary */}
      {q && !isLoading && total > 0 && (
        <div style={{
          marginBottom: 24, display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', gap: 12,
        }}>
          <p style={{ fontWeight: 700, fontSize: 16, color: '#F0F4FF', margin: 0 }}>
            <span style={{ color: '#00C9B1' }}>{total.toLocaleString('en-IN')}</span>
            {' '}{mode === 'smart' ? 'semantic matches' : 'jobs'} for &ldquo;{q}&rdquo;
            {location !== 'India' && (
              <span style={{ color: '#8B9DC3', fontWeight: 400 }}> in {location}</span>
            )}
          </p>

          {mode === 'keyword' && keywordSearch.data?.platforms_searched && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {keywordSearch.data.platforms_searched.map(p => <SourceBadge key={p} platform={p} />)}
            </div>
          )}

          {mode === 'smart' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11, color: '#00C9B1', padding: '2px 10px',
              borderRadius: 5, background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.2)',
              fontWeight: 700,
            }}>
              <Sparkles size={10} /> AI Semantic
            </span>
          )}

          {mode === 'keyword' && keywordSearch.data?.cached && (
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

        {/* Filter sidebar — only shown in keyword mode */}
        {mode === 'keyword' && (
          <aside className="search-sidebar">
            <Suspense fallback={<FilterLoading />}>
              <FilterSidebar />
            </Suspense>
          </aside>
        )}

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
                {mode === 'smart' ? 'Describe what you want' : 'Search for your next role'}
              </h2>
              <p style={{ fontSize: 14, color: '#8B9DC3', maxWidth: 320 }}>
                {mode === 'smart'
                  ? 'Type naturally — "I want a remote data role in Bangalore" or "backend work at a startup".'
                  : 'Enter a job title, skill, or keyword to search across 6 job portals simultaneously.'}
              </p>
            </div>
          ) : (
            <>
              <JobGrid
                jobs={jobs}
                isLoading={isLoading}
                error={error as Error | null}
                query={q}
                mode={mode}
              />

              {/* Smart Search pagination */}
              {mode === 'smart' && !isLoading && smartTotalPages > 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 12, marginTop: 32, paddingTop: 24,
                  borderTop: '1px solid #1E3A5F',
                }}>
                  <button
                    onClick={() => { setSmartPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={smartPage === 1}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 18px', borderRadius: 10, border: '1px solid #1E3A5F',
                      background: smartPage === 1 ? '#0A1628' : '#0F2044',
                      color: smartPage === 1 ? '#2A4A7F' : '#F0F4FF',
                      cursor: smartPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                    }}
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>

                  <span style={{ fontSize: 13, color: '#8B9DC3', fontWeight: 500 }}>
                    Page <span style={{ color: '#F0F4FF', fontWeight: 700 }}>{smartPage}</span>
                    {' '}of{' '}
                    <span style={{ color: '#F0F4FF', fontWeight: 700 }}>{smartTotalPages}</span>
                  </span>

                  <button
                    onClick={() => { setSmartPage(p => Math.min(smartTotalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={smartPage === smartTotalPages}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 18px', borderRadius: 10,
                      background: smartPage === smartTotalPages ? '#0A1628' : 'rgba(0,201,177,0.1)',
                      color: smartPage === smartTotalPages ? '#2A4A7F' : '#00C9B1',
                      cursor: smartPage === smartTotalPages ? 'not-allowed' : 'pointer',
                      fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                      border: smartPage === smartTotalPages ? '1px solid #1E3A5F' : '1px solid rgba(0,201,177,0.3)',
                    }}
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
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
