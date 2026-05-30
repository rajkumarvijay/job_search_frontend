'use client'

import { create } from 'zustand'
import { generateSessionId } from '@/lib/utils'

interface AppState {
  sessionId: string
  savedJobIds: Set<string>
  filters: {
    location: string
    platforms: string[]
    jobType: string
  }
  initSession: () => void
  setSavedIds: (ids: string[]) => void
  addSavedId: (id: string) => void
  removeSavedId: (id: string) => void
  setFilter: (key: string, value: string | string[]) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  sessionId: '',
  savedJobIds: new Set(),
  filters: {
    location: 'India',
    platforms: [],
    jobType: '',
  },

  initSession: () => {
    if (typeof window === 'undefined') return
    let id = localStorage.getItem('job_portal_session_id')
    if (!id) {
      id = generateSessionId()
      localStorage.setItem('job_portal_session_id', id)
    }
    set({ sessionId: id })
  },

  setSavedIds: (ids) => set({ savedJobIds: new Set(ids) }),
  addSavedId: (id) => set((s) => ({ savedJobIds: new Set([...s.savedJobIds, id]) })),
  removeSavedId: (id) =>
    set((s) => {
      const next = new Set(s.savedJobIds)
      next.delete(id)
      return { savedJobIds: next }
    }),

  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
}))
