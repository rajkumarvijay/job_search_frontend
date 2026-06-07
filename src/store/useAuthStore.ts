'use client'

import { create } from 'zustand'
import type { AuthUser } from '@/types'

interface AuthState {
  user:      AuthUser | null
  token:     string   | null
  isLoading: boolean
  setAuth:   (user: AuthUser, token: string) => void
  clearAuth: () => void
  initAuth:  () => void
}

const TOKEN_KEY = 'jq_auth_token'
const USER_KEY  = 'jq_auth_user'

export const useAuthStore = create<AuthState>((set) => ({
  user:      null,
  token:     null,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
    set({ user, token, isLoading: false })
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
    set({ user: null, token: null, isLoading: false })
  },

  initAuth: () => {
    if (typeof window === 'undefined') { set({ isLoading: false }); return }
    const token   = localStorage.getItem(TOKEN_KEY)
    const userStr = localStorage.getItem(USER_KEY)
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthUser
        set({ user, token, isLoading: false })
        return
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    set({ isLoading: false })
  },
}))
