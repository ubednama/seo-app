'use client'

import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="glass mt-12 border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2">
            <h3 className="text-xl font-bold gradient-text mb-4">SEO Performance Analyzer</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Analyze your website&apos;s SEO performance with AI-powered insights and actionable recommendations.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-lg glass-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 transition-all group"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg glass-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 transition-all"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg glass-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Features</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  SEO Analysis
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  AI Insights
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Performance Metrics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Reports
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; 2024 SEO Performance Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}