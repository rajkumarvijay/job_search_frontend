'use client'

import { create } from 'zustand'
import { generateSessionId } from '@/lib/utils'

interface AppState {
  sessionId: string
  initSession: () => void
}

export const useAppStore = create<AppState>((set) => ({
  sessionId: '',

  initSession: () => {
    if (typeof window === 'undefined') return
    let id = localStorage.getItem('job_portal_session_id')
    if (!id) {
      id = generateSessionId()
      localStorage.setItem('job_portal_session_id', id)
    }
    set({ sessionId: id })
  },
}))
