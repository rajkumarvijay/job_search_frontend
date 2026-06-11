import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const sessionId = localStorage.getItem('job_portal_session_id')
    if (sessionId) config.headers['X-Session-ID'] = sessionId
  }
  return config
})

export const jobsApi = {
  search: (params: {
    q: string
    location?: string
    platforms?: string
    results_per_site?: number
    page?: number
  }) => api.get('/jobs/search', { params }),
}

export const trendingApi = {
  roles: () => api.get('/trending/roles'),
  salaryBands: () => api.get('/trending/salary-bands'),
  keywords: () => api.get('/trending/keywords'),
  stats: () => api.get('/trending/stats'),
}

export const historyApi = {
  get: () => api.get('/history'),
  save: (data: { query: string; location: string; platforms: string; result_count: number }) =>
    api.post('/history', data),
  delete: (id: number) => api.delete(`/history/${id}`),
  clear: () => api.delete('/history'),
}

export const savedApi = {
  get: () => api.get('/saved'),
  save: (job: object) => api.post('/saved', job),
  remove: (jobId: string) => api.delete(`/saved/${jobId}`),
}

export const resumeApi = {
  /** Fast ATS score — used by the search-bar button */
  analyse: (file: File, targetRole = '') => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('target_role', targetRole)
    return api.post('/ai/resume', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 90_000,
    })
  },
  /** Full analysis + job recommendations — used by /resume page */
  full: (file: File, targetRole = '', jobCount = 6) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('target_role', targetRole)
    fd.append('job_count', String(jobCount))
    return api.post('/ai/resume/full', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120_000,
    })
  },
}

export const coverLetterApi = {
  generate: (params: {
    job_description: string
    candidate_name?: string
    company_name?: string
    job_title?: string
    tone?: string
    file?: File | null
    resume_text?: string
  }) => {
    const fd = new FormData()
    fd.append('job_description', params.job_description)
    if (params.candidate_name) fd.append('candidate_name', params.candidate_name)
    if (params.company_name)   fd.append('company_name',   params.company_name)
    if (params.job_title)      fd.append('job_title',      params.job_title)
    if (params.tone)           fd.append('tone',           params.tone)
    if (params.file)           fd.append('file',           params.file)
    if (params.resume_text)    fd.append('resume_text',    params.resume_text)
    return api.post('/ai/cover-letter', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 90_000,
    })
  },
}

export const postJobApi = {
  submit:   (data: object)                          => api.post('/post-jobs/', data),
  list:     (q = '', email = '')                    => api.get('/post-jobs/', { params: { q, email } }),
  get:      (jobId: string)                         => api.get(`/post-jobs/${jobId}`),
  update:   (jobId: string, data: object)           => api.put(`/post-jobs/${jobId}`, data),
  remove:   (jobId: string, contact_email: string)  => api.delete(`/post-jobs/${jobId}`, { data: { contact_email } }),
  byEmail:  (email: string)                         => api.get('/post-jobs/', { params: { email } }),
}

export const paymentApi = {
  plans: () => api.get('/payments/plans'),
  subscription: () => api.get('/payments/subscription'),
  createOrder: (product_key: string, idempotency_key: string) =>
    api.post('/payments/create-order', { product_key, idempotency_key }),
  verify: (data: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => api.post('/payments/verify', data),
}
