'use client'

import { useState } from 'react'
import URLSubmissionForm from '@/components/seo/URLSubmissionForm'
import ReportsTable from '@/components/seo/ReportsTable'
import ReportsGrid from '@/components/seo/ReportsGrid'
import { useSEOReports } from '@/lib/hooks/useSEOReports'
import LoadingSpinner from '@/components/layout/LoadingSpinner'

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
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Reports</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          SEO Performance Analyzer
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Analyze your website&apos;s SEO performance with AI-powered insights and actionable recommendations.
        </p>
      </div>

      {/* URL Submission Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Submit Website for Analysis
        </h2>
        <URLSubmissionForm onSuccess={handleNewReport} />
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Analysis Reports
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid View
              </button>
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
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
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Reports Yet
            </h3>
            <p className="text-gray-600">
              Submit a website URL above to get started with your first SEO analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}