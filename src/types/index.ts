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

export type Platform = 'linkedin' | 'indeed' | 'glassdoor' | 'naukri' | 'ziprecruiter' | 'google' | 'portal'

export interface PostJobPayload {
  title: string
  company: string
  location: string
  job_type?: string
  work_mode?: string
  experience?: string
  min_salary?: number
  max_salary?: number
  salary_currency?: string
  description: string
  skills?: string
  contact_email: string
  apply_url?: string
  company_url?: string
}

export interface PostedJobOut extends PostJobPayload {
  job_id: string
  is_active: boolean
  posted_at: string
}

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

export interface QuickWin {
  action: string
  time_required: string
  score_impact: string
}

export interface Strength {
  title: string
  explanation: string
}

export interface ExperienceEntry {
  company: string
  title: string
  duration: string
  is_quantified: boolean
  key_achievements: string[]
  impact_score: number
}

export interface Project {
  name: string
  tech_stack: string[]
  description: string
  has_metrics: boolean
  github_mentioned: boolean
}

export interface EducationEntry {
  degree: string
  institution: string
  year: string
  gpa_cgpa: string | null
}

export interface ExtractedSkills {
  technical: string[]
  soft: string[]
  tools: string[]
  certifications: string[]
}

export interface KeywordDensity {
  present: string[]
  overused: string[]
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
  strengths: Strength[] | string[]
  improvements: Improvement[]
  missing_keywords: string[]
  recommended_keywords: string[]
  format_issues: string[]
  quick_wins: QuickWin[] | string[]
  // enriched fields
  extracted_skills?: ExtractedSkills
  experience_breakdown?: ExperienceEntry[]
  projects?: Project[]
  education?: EducationEntry[]
  keyword_density?: KeywordDensity
  indian_job_market_tips?: string[]
  recommended_jobs?: RecommendedJob[]
  error?: string
}

export interface JobMatchSkill {
  skill: string
  found_in_resume?: string
  jd_requirement?: string
  proficiency?: string
}

export interface MissingSkill {
  skill: string
  importance: 'Must-have' | 'Nice-to-have'
  jd_context?: string
  gap_size?: 'Large' | 'Medium' | 'Small'
}

export interface MatchStrength {
  title: string
  detail: string
  impact?: 'High' | 'Medium'
}

export interface LearningRecommendation {
  skill: string
  reason: string
  resource: string
  timeframe: string
  priority: 'High' | 'Medium' | 'Low'
}

export interface JobMatchResult {
  match_score: number
  match_grade: string
  match_summary: string
  matched_skills: JobMatchSkill[]
  missing_skills: MissingSkill[]
  strengths: MatchStrength[]
  learning_recommendations: LearningRecommendation[]
  experience_match?: {
    required_years: number | null
    candidate_years: number | null
    verdict: string
  }
  role_fit_tags: string[]
  quick_actions: string[]
  error?: string
}

export interface CoverLetterResult {
  cover_letter: string
  subject_line: string
  key_matches: string[]
  tone_used: string
  word_count: number
  tips: string[]
  error?: string
}
