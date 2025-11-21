import axios from 'axios'
import { SEOReport, SEOAnalysisRequest, SEOAnalysisResponse, SEOReportList } from '@/types/seo'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || '/api/v1'

const api = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 404) {
      throw new Error('Resource not found')
    }
    if (error.response?.status === 500) {
      throw new Error('Internal server error')
    }
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw error
  }
)

export const submitURLForAnalysis = async (url: string): Promise<SEOAnalysisResponse> => {
  const request: SEOAnalysisRequest = {
    url: url as any,
    include_ai_insights: true,
  }
  
  const response = await api.post('/seo-reports/analyze', request)
  return response.data
}

export const getSEOReports = async (skip = 0, limit = 10, status?: string): Promise<SEOReportList> => {
  const params = new URLSearchParams()
  params.append('skip', skip.toString())
  params.append('limit', limit.toString())
  if (status) {
    params.append('status', status)
  }
  
  const response = await api.get(`/seo-reports?${params.toString()}`)
  return response.data
}

export const getSEOReport = async (id: number): Promise<SEOReport> => {
  const response = await api.get(`/seo-reports/${id}`)
  return response.data
}

export default api