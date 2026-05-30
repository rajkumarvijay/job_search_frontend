'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clock, X, Trash2, MapPin } from 'lucide-react'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { INDIA_CITIES } from '@/lib/constants'

interface Props {
  defaultQuery?: string
  defaultLocation?: string
}

export function SearchBar({ defaultQuery = '', defaultLocation = 'India' }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultQuery)
  const [location, setLocation] = useState(defaultLocation)
  const [focused, setFocused] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { history, removeEntry, clearHistory } = useSearchHistory()

  useEffect(() => { setQuery(defaultQuery); setLocation(defaultLocation) }, [defaultQuery, defaultLocation])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setShowHistory(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const submit = () => {
    const q = query.trim()
    if (!q) return
    setShowHistory(false)
    router.push(`/search?q=${encodeURIComponent(q)}&location=${encodeURIComponent(location)}`)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        background: '#0F2044',
        border: `1.5px solid ${focused ? '#00C9B1' : '#1E3A5F'}`,
        borderRadius: 16,
        boxShadow: focused ? '0 0 0 3px rgba(0,201,177,0.12)' : 'none',
        transition: 'all 0.2s',
        overflow: 'hidden',
      }}>
        {/* Query */}
        <div style={{ flex: '1 1 220px', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderRight: '1px solid #1E3A5F', minHeight: 56 }}>
          <Search size={16} color="#00C9B1" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); if (history.length) setShowHistory(true) }}
            onBlur={() => setFocused(false)}
            onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setShowHistory(false) }}
            placeholder="Job title, skills or keywords..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F0F4FF', fontSize: 15 }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#8B9DC3' }}>
              <X size={14} />
            </button>
          )}
        </div>
        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: '1px solid #1E3A5F', minWidth: 150, minHeight: 56 }}>
          <MapPin size={14} color="#8B9DC3" />
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#F0F4FF', fontSize: 14, cursor: 'pointer' }}
          >
            {INDIA_CITIES.map(c => <option key={c} value={c} style={{ background: '#0F2044' }}>{c}</option>)}
          </select>
        </div>
        {/* Button */}
        <button onClick={submit} className="jq-btn" style={{ margin: 6, padding: '0 22px', borderRadius: 11, minHeight: 44 }}>
          <Search size={15} />
          Search
        </button>
      </div>

      {/* History dropdown */}
      {showHistory && history.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          marginTop: 6, background: '#0F2044', border: '1px solid #1E3A5F', borderRadius: 14,
          boxShadow: '0 16px 40px rgba(0,0,0,0.4)', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #1E3A5F' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8B9DC3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recent</span>
            <button
              onClick={clearHistory}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#8B9DC3' }}
            >
              <Trash2 size={11} /> Clear all
            </button>
          </div>
          {history.slice(0, 6).map(entry => (
            <div
              key={entry.id}
              onClick={() => { setQuery(entry.query); setShowHistory(false); router.push(`/search?q=${encodeURIComponent(entry.query)}&location=${encodeURIComponent(entry.location)}`) }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(30,58,95,0.4)' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(30,58,95,0.4)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
            >
              <Clock size={13} color="#8B9DC3" />
              <span style={{ flex: 1, fontSize: 14, color: '#F0F4FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.query}</span>
              <span style={{ fontSize: 12, color: '#8B9DC3', flexShrink: 0 }}>{entry.location}</span>
              <button
                onClick={e => { e.stopPropagation(); removeEntry(entry.id) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#8B9DC3', opacity: 0.6 }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
