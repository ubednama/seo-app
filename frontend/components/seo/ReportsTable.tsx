'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ExternalLink, Clock, AlertCircle, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react'
import { SEOReport } from '@/types/seo'
import SEOScore from './SEOScore'
import Card from '@/components/ui/Card'

interface ReportsTableProps {
  reports: SEOReport[]
}

export default function ReportsTable({ reports }: ReportsTableProps) {
  const [sortField, setSortField] = useState<'created_at' | 'seo_score' | 'url'>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const sortedReports = [...reports].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === 'created_at') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSort = (field: 'created_at' | 'seo_score' | 'url') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success-500 dark:text-success-400" />
      case 'processing':
        return <Clock className="h-4 w-4 text-warning-500 dark:text-warning-400 animate-pulse" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-error-500 dark:text-error-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400 dark:text-gray-600" />
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

  const SortIcon = () => (
    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  )

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="glass-sm">
            <tr>
              <th
                onClick={() => handleSort('url')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Website
                  {sortField === 'url' && <SortIcon />}
                </div>
              </th>
              <th
                onClick={() => handleSort('seo_score')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  SEO Score
                  {sortField === 'seo_score' && <SortIcon />}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th
                onClick={() => handleSort('created_at')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Created
                  {sortField === 'created_at' && <SortIcon />}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedReports.map((report, index) => (
              <tr
                key={report.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {report.url}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {report.title || 'No title'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {report.seo_score !== null ? (
                    <SEOScore score={report.seo_score} />
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-600">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {getStatusText(report.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(report.created_at), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/seo-reports/${report.id}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {sortedReports.map((report, index) => (
          <Card
            key={report.id}
            className="p-4 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {new URL(report.url).hostname}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {report.url}
                </p>
              </div>
              {getStatusIcon(report.status)}
            </div>

            {report.seo_score !== null && (
              <div className="mb-3">
                <SEOScore score={report.seo_score} />
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(report.created_at), 'MMM dd, yyyy')}
              </span>
              <Link
                href={`/seo-reports/${report.id}`}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-md hover:scale-105"
              >
                View Details
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}