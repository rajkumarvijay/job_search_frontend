'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { JobGrid } from '@/components/search/JobGrid'
import { FilterSidebar } from '@/components/search/FilterSidebar'
import { useJobSearch } from '@/hooks/useJobSearch'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SourceBadge } from '@/components/search/SourceBadge'

function SearchResults() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const location = searchParams.get('location') ?? 'India'
  const platforms = searchParams.get('platforms') ?? 'all'
  const { addEntry } = useSearchHistory()

  const { data, isLoading, error } = useJobSearch(
    { q, location, platforms, results_per_site: 10 },
    !!q
  )

  useEffect(() => {
    if (data && q) {
      addEntry(q, location, data.total)
    }
  }, [data?.total, q])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search bar */}
      <div className="mb-8">
        <SearchBar defaultQuery={q} defaultLocation={location} />
      </div>

      {/* Results summary */}
      {q && !isLoading && data && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="text-[#F0F4FF] font-semibold">
            {data.total.toLocaleString()} jobs for &ldquo;<span className="text-teal">{q}</span>&rdquo;
            {location !== 'India' && <span className="text-[#8B9DC3]"> in {location}</span>}
          </p>
          {data.platforms_searched.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {data.platforms_searched.map((p) => (
                <SourceBadge key={p} platform={p} />
              ))}
            </div>
          )}
          {data.cached && (
            <span className="text-[#8B9DC3] text-xs px-2 py-0.5 rounded bg-navy-800 border border-navy-600">cached</span>
          )}
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <FilterSidebar />
        </aside>

        {/* Job grid */}
        <div className="flex-1 min-w-0">
          {!q ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-4">
                <span className="text-teal text-2xl">🔍</span>
              </div>
              <h2 className="font-heading font-bold text-[#F0F4FF] text-xl mb-2">Search for your next role</h2>
              <p className="text-[#8B9DC3] text-sm max-w-xs">
                Enter a job title, skill, or keyword above to search across 6 job portals.
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

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  )
}
