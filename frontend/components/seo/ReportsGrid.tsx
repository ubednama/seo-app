'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ExternalLink, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { SEOReport } from '@/types/seo'
import SEOScore from './SEOScore'
import Card from '@/components/ui/Card'

interface ReportsGridProps {
  reports: SEOReport[]
}

export default function ReportsGrid({ reports }: ReportsGridProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />
      case 'processing':
        return <Clock className="h-5 w-5 text-warning-500 dark:text-warning-400 animate-pulse" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-error-500 dark:text-error-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-400 dark:text-gray-600" />
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
    if (score === null) return 'glass-sm text-gray-600 dark:text-gray-400'
    if (score >= 80) return 'bg-gradient-to-r from-success-500 to-success-600 text-white'
    if (score >= 60) return 'bg-gradient-to-r from-warning-500 to-warning-600 text-white'
    return 'bg-gradient-to-r from-error-500 to-error-600 text-white'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report, index) => (
        <Card
          key={report.id}
          className="p-6 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2">
                <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-600 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {new URL(report.url).hostname}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Score</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full shadow-md ${getScoreColor(report.seo_score)}`}>
                  {report.seo_score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${report.seo_score >= 80
                      ? 'bg-gradient-to-r from-success-500 to-success-600'
                      : report.seo_score >= 60
                        ? 'bg-gradient-to-r from-warning-500 to-warning-600'
                        : 'bg-gradient-to-r from-error-500 to-error-600'
                    }`}
                  style={{ width: `${report.seo_score}%` }}
                />
              </div>
            </div>
          )}

          {report.title && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{report.title}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="glass-sm rounded-lg p-2">
              <span className="text-gray-500 dark:text-gray-400">H1 Tags</span>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{report.h1_tags?.length || 0}</div>
            </div>
            <div className="glass-sm rounded-lg p-2">
              <span className="text-gray-500 dark:text-gray-400">H2 Tags</span>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{report.h2_tags?.length || 0}</div>
            </div>
            <div className="glass-sm rounded-lg p-2">
              <span className="text-gray-500 dark:text-gray-400">Images</span>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{report.images?.length || 0}</div>
            </div>
            <div className="glass-sm rounded-lg p-2">
              <span className="text-gray-500 dark:text-gray-400">Links</span>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{report.links?.length || 0}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(report.created_at), 'MMM dd, yyyy')}
            </div>
            <Link
              href={`/seo-reports/${report.id}`}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg shadow-primary-500/50 dark:shadow-primary-500/30 hover:scale-105"
            >
              View Details
            </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}