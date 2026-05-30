import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PLATFORMS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(min?: number, max?: number, currency = 'INR', interval?: string): string {
  if (!min && !max) return 'Salary not disclosed'

  const fmt = (n: number) => {
    if (currency === 'INR') {
      if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
      if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
      return `₹${n}`
    }
    return `$${n.toLocaleString()}`
  }

  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `${fmt(min)}+`
  if (max) return `Up to ${fmt(max)}`
  return 'Not disclosed'
}

export function timeAgo(dateStr?: string): string {
  if (!dateStr) return 'Recently'
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  } catch {
    return 'Recently'
  }
}

export function getPlatformColor(platform: string): string {
  const p = PLATFORMS.find(pl => pl.id === platform.toLowerCase())
  return p?.color ?? '#8B9DC3'
}

export function getPlatformLabel(platform: string): string {
  const p = PLATFORMS.find(pl => pl.id === platform.toLowerCase())
  return p?.label ?? platform
}

export function truncate(str: string, maxLen: number): string {
  if (!str) return ''
  return str.length <= maxLen ? str : str.slice(0, maxLen) + '...'
}

export function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
