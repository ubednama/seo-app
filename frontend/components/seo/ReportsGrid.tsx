'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ExternalLink, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { SEOReport } from '@/types/seo'
import SEOScore from './SEOScore'

interface ReportsGridProps {
  reports: SEOReport[]
}

export default function ReportsGrid({ reports }: ReportsGridProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-warning-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-error-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'processing':
        return 'Processing'
      case 'failed':
        return 'Failed'
      default:
        return 'Pending'
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-gray-100 text-gray-600'
    if (score >= 80) return 'bg-success-100 text-success-800'
    if (score >= 60) return 'bg-warning-100 text-warning-800'
    return 'bg-error-100 text-error-800'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-2">
                  <ExternalLink className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {new URL(report.url).hostname}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {report.url}
                </p>
              </div>
              <div className="ml-3">
                {getStatusIcon(report.status)}
              </div>
            </div>

            {report.seo_score !== null && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">SEO Score</span>
                  <span className={`text-sm font-bold px-2 py-1 rounded-full ${getScoreColor(report.seo_score)}`}>
                    {report.seo_score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      report.seo_score >= 80
                        ? 'bg-success-500'
                        : report.seo_score >= 60
                        ? 'bg-warning-500'
                        : 'bg-error-500'
                    }`}
                    style={{ width: `${report.seo_score}%` }}
                  />
                </div>
              </div>
            )}

            {report.title && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Title</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{report.title}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">H1 Tags:</span>
                <span className="ml-1 font-medium">{report.h1_tags?.length || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">H2 Tags:</span>
                <span className="ml-1 font-medium">{report.h2_tags?.length || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Images:</span>
                <span className="ml-1 font-medium">{report.images?.length || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Links:</span>
                <span className="ml-1 font-medium">{report.links?.length || 0}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {format(new Date(report.created_at), 'MMM dd, yyyy')}
              </div>
              <Link
                href={`/seo-reports/${report.id}`}
                className="inline-flex items-center px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}