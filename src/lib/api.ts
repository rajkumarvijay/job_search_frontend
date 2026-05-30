import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const sessionId = localStorage.getItem('job_portal_session_id')
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId
    }
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
