export interface JobResult {
  job_id: string
  title: string
  company: string
  location?: string
  min_salary?: number
  max_salary?: number
  salary_currency?: string
  salary_interval?: string
  job_url?: string
  platform: string
  description?: string
  date_posted?: string
  job_type?: string
  is_remote?: boolean
  company_logo?: string
  company_url?: string
}

export interface SearchResponse {
  query: string
  location: string
  total: number
  page: number
  per_page: number
  jobs: JobResult[]
  platforms_searched: string[]
  cached: boolean
}

export interface SearchHistoryEntry {
  id: number
  session_id: string
  query: string
  location: string
  platforms: string
  result_count: number
  searched_at: string
}

export interface TrendingRole {
  role: string
  count: number
  top_skill: string
  avg_salary_lpa?: string
  icon: string
}

export interface SalaryBand {
  role: string
  fresher: string
  mid: string
  senior: string
  currency: string
}

export interface TrendingKeyword {
  keyword: string
  count: number
  trend: string
}

export interface StatsResponse {
  total_active_jobs: number
  top_salary_lpa: string
  platform_count: number
  cities_covered: number
}

export interface SavedJob {
  id: number
  session_id: string
  job_id: string
  title: string
  company: string
  location?: string
  min_salary?: number
  max_salary?: number
  salary_currency?: string
  job_url?: string
  platform?: string
  description?: string
  date_posted?: string
  saved_at: string
}

export type Platform = 'linkedin' | 'indeed' | 'glassdoor' | 'naukri' | 'ziprecruiter' | 'google'

export interface SectionScores {
  contact_info: number
  professional_summary: number
  work_experience: number
  skills: number
  education: number
  keywords_and_ats: number
}

export interface Improvement {
  category: string
  issue: string
  fix: string
  impact: 'High' | 'Medium' | 'Low'
}

export interface RecommendedJob {
  job_id: string
  title: string
  company: string
  location: string
  job_url?: string
  description?: string
  min_salary?: number
  max_salary?: number
  salary_currency?: string
  job_type?: string
  is_remote?: boolean
  platform: string
  match_score: number
  match_reason: string
}

export interface ResumeResult {
  ats_score: number
  grade: string
  experience_level: string
  years_experience: number | null
  summary: string
  section_scores: SectionScores
  top_skills: string[]
  recommended_roles: string[]
  strengths: string[]
  improvements: Improvement[]
  missing_keywords: string[]
  recommended_keywords: string[]
  format_issues: string[]
  quick_wins: string[]
  recommended_jobs?: RecommendedJob[]
  error?: string
}
