import { describe, it, expect } from 'vitest'
import { formatSalary, timeAgo, truncate } from '../utils'

describe('formatSalary', () => {
  it('returns "Salary not disclosed" when no values are given', () => {
    expect(formatSalary()).toBe('Salary not disclosed')
  })

  it('formats an INR range in lakhs', () => {
    expect(formatSalary(600000, 900000)).toBe('\u20b96.0L \u2013 \u20b99.0L')
  })

  it('formats a USD minimum-only salary', () => {
    expect(formatSalary(80000, undefined, 'USD')).toBe('$80,000+')
  })

  it('formats a max-only salary', () => {
    expect(formatSalary(undefined, 500000)).toBe('Up to \u20b95.0L')
  })
})

describe('timeAgo', () => {
  it('returns "Recently" for an undefined date', () => {
    expect(timeAgo(undefined)).toBe('Recently')
  })

  it('returns "Today" for the current date', () => {
    expect(timeAgo(new Date().toISOString())).toBe('Today')
  })

  it('does not throw for an invalid date string', () => {
    expect(typeof timeAgo('not-a-date')).toBe('string')
  })
})

describe('truncate', () => {
  it('returns the original string when shorter than maxLen', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates and appends an ellipsis when longer than maxLen', () => {
    expect(truncate('hello world', 5)).toBe('hello...')
  })

  it('returns an empty string for falsy input', () => {
    expect(truncate('', 5)).toBe('')
  })
})
