export interface SEOReport {
  id: number
  url: string
  title: string | null
  meta_description: string | null
  h1_tags: string[]
  h2_tags: string[]
  images: Array<{
    src: string
    alt: string
    width?: string
    height?: string
  }>
  links: Array<{
    href: string
    text: string
    rel?: string[]
    target?: string
  }>
  load_time: number | null
  accessibility_score: number | null
  performance_score: number | null
  seo_score: number | null
  ai_insights: string | null
  ai_recommendations: string[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message: string | null
  created_at: string
  updated_at: string | null
}

export interface SEOReportList {
  reports: SEOReport[]
  total: number
  page: number
  per_page: number
}

export interface SEOAnalysisRequest {
  url: string
  include_ai_insights: boolean
}

export interface SEOAnalysisResponse {
  report_id: number
  status: 'processing' | 'completed'
  message: string
}

export interface SEOReportCreate {
  url: string
}

export interface SEOMetrics {
  title_score: number
  meta_description_score: number
  h1_tags_score: number
  h2_tags_score: number
  images_score: number
  links_score: number
  performance_score: number
}

export interface SEOIssues {
  critical: string[]
  warnings: string[]
  suggestions: string[]
}