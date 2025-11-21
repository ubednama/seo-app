import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getSEOReports, getSEOReport, submitURLForAnalysis } from '@/lib/api'
import { SEOReport, SEOReportList } from '@/types/seo'

// Hook for fetching SEO reports list
export function useSEOReports(skip = 0, limit = 10, status?: string) {
  return useQuery<SEOReportList, Error>(
    ['seo-reports', skip, limit, status],
    () => getSEOReports(skip, limit, status),
    {
      staleTime: 30000, // 30 seconds
      refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    }
  )
}

// Hook for fetching a single SEO report
export function useSEOReport(id: number) {
  return useQuery<SEOReport, Error>(
    ['seo-report', id],
    () => getSEOReport(id),
    {
      staleTime: 60000, // 1 minute
      refetchInterval: (data) => {
        // Keep refetching if the report is still processing
        return data?.status === 'processing' ? 5000 : false
      },
    }
  )
}

// Hook for submitting URL for analysis
export function useSubmitURL() {
  const queryClient = useQueryClient()

  return useMutation<SEOReport, Error, string>(
    (url: string) => submitURLForAnalysis(url).then(response => {
      // If the report is already completed, we need to fetch it
      if (response.status === 'completed') {
        return getSEOReport(response.report_id)
      }
      // Return a placeholder report for processing status
      return {
        id: response.report_id,
        url: url,
        status: 'processing',
        created_at: new Date().toISOString(),
        title: null,
        meta_description: null,
        h1_tags: [],
        h2_tags: [],
        images: [],
        links: [],
        load_time: null,
        accessibility_score: null,
        performance_score: null,
        seo_score: null,
        ai_insights: null,
        ai_recommendations: [],
        error_message: null,
        updated_at: null,
      }
    }),
    {
      onSuccess: () => {
        // Invalidate and refetch the reports list
        queryClient.invalidateQueries('seo-reports')
      },
    }
  )
}