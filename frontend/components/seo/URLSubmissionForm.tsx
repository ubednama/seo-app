'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Send, Globe } from 'lucide-react'
import { submitURLForAnalysis } from '@/lib/api'

interface URLSubmissionFormProps {
  onSuccess?: () => void
}

interface FormData {
  url: string
}

export default function URLSubmissionForm({ onSuccess }: URLSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      const result = await submitURLForAnalysis(data.url)

      if (result.status === 'processing') {
        toast.success('Analysis started! Check back in a few moments.')
      } else if (result.status === 'completed') {
        toast.success('Analysis completed successfully!')
      }

      reset()
      onSuccess?.()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to start analysis: ${error.message}`)
      } else {
        toast.error('Failed to start analysis. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Website URL
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
            <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            {...register('url', {
              required: 'URL is required',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Please enter a valid URL starting with http:// or https://'
              }
            })}
            type="url"
            id="url"
            className="block w-full pl-12 pr-4 py-3.5 glass-sm rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
            placeholder="https://example.com"
            disabled={isSubmitting}
          />
        </div>
        {errors.url && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-slide-down">{errors.url.message}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Analysis typically takes 30-60 seconds to complete.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/50 dark:shadow-primary-500/30 hover:scale-105 hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Analyze Website
            </>
          )}
        </button>
      </div>
    </form>
  )
}