'use client'

import { useState } from 'react'
import URLSubmissionForm from '@/components/seo/URLSubmissionForm'
import ReportsTable from '@/components/seo/ReportsTable'
import ReportsGrid from '@/components/seo/ReportsGrid'
import { useSEOReports } from '@/lib/hooks/useSEOReports'
import LoadingSpinner from '@/components/layout/LoadingSpinner'
import Card from '@/components/ui/Card'
import { FileText } from 'lucide-react'

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const { data: reports, isLoading, error, refetch } = useSEOReports()

  const handleNewReport = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="text-center py-12 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Reports</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:scale-105"
        >
          Try Again
        </button>
      </Card>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
          <span className="gradient-text">SEO Performance Analyzer</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto animate-slide-up">
          Analyze your website&apos;s SEO performance with AI-powered insights and actionable recommendations.
        </p>
      </div>

      {/* URL Submission Form */}
      <Card className="p-6 sm:p-8 animate-slide-up">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Submit Website for Analysis
        </h2>
        <URLSubmissionForm onSuccess={handleNewReport} />
      </Card>

      {/* Reports Section */}
      <Card className="p-6 sm:p-8 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Analysis Reports
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex glass-sm rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'table'
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'grid'
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
              >
                Grid View
              </button>
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg hover:scale-105"
            >
              Refresh
            </button>
          </div>
        </div>

        {reports && reports.reports.length > 0 ? (
          viewMode === 'table' ? (
            <ReportsTable reports={reports.reports} />
          ) : (
            <ReportsGrid reports={reports.reports} />
          )
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-sm mb-6">
              <FileText className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Reports Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Submit a website URL above to get started with your first SEO analysis.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}