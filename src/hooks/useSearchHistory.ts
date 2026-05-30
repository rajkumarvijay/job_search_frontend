'use client'

import { useState, useEffect, useCallback } from 'react'
import { historyApi } from '@/lib/api'
import type { SearchHistoryEntry } from '@/types'

const LOCAL_KEY = 'job_search_history'

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch {}
    }

    historyApi.get().then(({ data }) => {
      setHistory(data)
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
    }).catch(() => {})
  }, [])

  const addEntry = useCallback(async (query: string, location: string, resultCount: number) => {
    try {
      const { data } = await historyApi.save({
        query,
        location,
        platforms: 'all',
        result_count: resultCount,
      })
      setHistory((prev) => {
        const next = [data, ...prev.filter((e) => e.query !== query)].slice(0, 20)
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
        return next
      })
    } catch {}
  }, [])

  const removeEntry = useCallback(async (id: number) => {
    try {
      await historyApi.delete(id)
      setHistory((prev) => {
        const next = prev.filter((e) => e.id !== id)
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
        return next
      })
    } catch {}
  }, [])

  const clearHistory = useCallback(async () => {
    try {
      await historyApi.clear()
      setHistory([])
      localStorage.removeItem(LOCAL_KEY)
    } catch {}
  }, [])

  return { history, addEntry, removeEntry, clearHistory }
}
