'use client'

import { useEffect, useState } from 'react'
import { useSEOReport } from '@/lib/hooks/useSEOReports'
import LoadingSpinner from '@/components/layout/LoadingSpinner'
import SEOScore from '@/components/seo/SEOScore'
import { format } from 'date-fns'
import { ArrowLeft, ExternalLink, Clock, AlertCircle, CheckCircle, Globe, Image, Link as LinkIcon, Hash, Download } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { toast } from 'sonner'
import axios from 'axios'

interface ReportPageProps {
  params: {
    id: string
  }
}

export default function ReportPage({ params }: ReportPageProps) {
  const { data: report, isLoading, error } = useSEOReport(parseInt(params.id))
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seo-reports/${params.id}/pdf`,
        {
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      let filename = "";

      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);

        if (matches != null && matches[1]) {
          filename = matches[1];

          filename = filename.replace(/['"]/g, ""); // Remove " or '
          filename = filename.replace(/^_+|_+$/g, ""); // Remove _ at start or end
        }
      }

      if (!filename && report) {
        const baseName = report.title
          ? report.title
          : new URL(report.url).hostname.replace("www.", "");

        // Sanitize client-side
        const sanitized = baseName
          .replace(/[^a-z0-9]/gi, "_") // Replace special chars
          .replace(/_+/g, "_") // Collapse underscores
          .replace(/^_+|_+$/g, "") // Trim start/end underscores
          .toLowerCase();

        filename = `${sanitized}.pdf`;
      }

      // 3. Final safety net
      if (!filename || filename === ".pdf") {
        filename = `report-${params.id}.pdf`;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Failed to download PDF", error);
      toast.error("Failed to download PDF. Please try again later.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (report?.status === 'processing') {
      const interval = setInterval(() => {
        // React Query will handle the refetch automatically
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [report?.status])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !report) {
    return notFound()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-success-500" />
      case 'processing':
        return <Clock className="h-6 w-6 text-warning-500" />
      case 'failed':
        return <AlertCircle className="h-6 w-6 text-error-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-400" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isDownloading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </>
              )}
            </button>
            <div className="flex items-center space-x-2">
              {getStatusIcon(report.status)}
              <span className="text-lg font-medium capitalize">{report.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SEO Analysis Report
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              <ExternalLink className="h-5 w-5 mr-2" />
              <span className="break-all">{report.url}</span>
            </div>
            <p className="text-gray-600">
              Generated on {format(new Date(report.created_at), 'MMMM dd, yyyy at HH:mm')}
            </p>
          </div>

          <div className="flex items-center justify-center">
            {report.seo_score !== null ? (
              <div className="text-center">
                <div className="text-6xl font-bold text-primary-600 mb-2">
                  {report.seo_score}
                </div>
                <div className="text-lg text-gray-600">SEO Score</div>
                <SEOScore score={report.seo_score} size="large" showLabel />
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-6xl font-bold mb-2">-</div>
                <div className="text-lg">Score Pending</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      {report.load_time !== null && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {report.load_time.toFixed(2)}s
              </div>
              <div className="text-gray-600">Load Time</div>
            </div>
            {report.accessibility_score !== null && (
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {report.accessibility_score.toFixed(0)}/100
                </div>
                <div className="text-gray-600">Accessibility</div>
              </div>
            )}
            {report.performance_score !== null && (
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {report.performance_score.toFixed(0)}/100
                </div>
                <div className="text-gray-600">Performance</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Title and Meta */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Page Content</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <Globe className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-medium text-gray-700">Title</span>
              </div>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {report.title || 'No title found'}
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Hash className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-medium text-gray-700">Meta Description</span>
              </div>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {report.meta_description || 'No meta description found'}
              </p>
            </div>
          </div>
        </div>

        {/* Headings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Headings Structure</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">H1 Tags</span>
                <span className="text-sm text-gray-500">({report.h1_tags?.length || 0})</span>
              </div>
              <div className="space-y-2">
                {report.h1_tags?.map((tag, index) => (
                  <div key={index} className="text-gray-600 bg-gray-50 p-2 rounded">
                    {tag}
                  </div>
                )) || <p className="text-gray-500">No H1 tags found</p>}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">H2 Tags</span>
                <span className="text-sm text-gray-500">({report.h2_tags?.length || 0})</span>
              </div>
              <div className="space-y-2">
                {report.h2_tags?.slice(0, 5).map((tag, index) => (
                  <div key={index} className="text-gray-600 bg-gray-50 p-2 rounded">
                    {tag}
                  </div>
                ))}
                {report.h2_tags && report.h2_tags.length > 5 && (
                  <p className="text-sm text-gray-500">
                    ... and {report.h2_tags.length - 5} more
                  </p>
                )}
                {!report.h2_tags?.length && <p className="text-gray-500">No H2 tags found</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Images and Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Images ({report.images?.length || 0})
          </h3>
          
          {report.images && report.images.length > 0 ? (
            <div className="space-y-3">
              {report.images.slice(0, 5).map((image, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Image className="h-5 w-5 text-gray-400 mr-3" aria-label="Image icon" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.src.split('/').pop()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {image.alt ? 'Has alt text' : 'Missing alt text'}
                      </p>
                    </div>
                  </div>
                  {!image.alt && (
                    <span className="text-xs text-error-600 bg-error-100 px-2 py-1 rounded">
                      Fix
                    </span>
                  )}
                </div>
              ))}
              {report.images.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  ... and {report.images.length - 5} more images
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No images found</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Links ({report.links?.length || 0})
          </h3>
          
          {report.links && report.links.length > 0 ? (
            <div className="space-y-3">
              {report.links.slice(0, 5).map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center min-w-0">
                    <LinkIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {link.text || link.href}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {link.href}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {report.links.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  ... and {report.links.length - 5} more links
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No links found</p>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Insights</h3>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
          </div>
        </div>
      ) : report.ai_insights && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Insights</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {report.ai_insights}
            </p>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {report.ai_recommendations && report.ai_recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            {report.ai_recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {report.error_message && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-error-800 mb-2">Analysis Error</h3>
          <p className="text-error-700">{report.error_message}</p>
        </div>
      )}
    </div>
  )
}