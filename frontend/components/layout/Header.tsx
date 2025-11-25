'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg' : 'glass-lg'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <BarChart3 className="h-8 w-8 text-primary-600 dark:text-primary-400 transform group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">
              SEO Analyzer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors relative group"
            >
              Analytics
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors relative group"
            >
              Documentation
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <button className="hidden sm:inline-flex px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-primary-500/50 dark:shadow-primary-500/30 hover:scale-105">
              Get Started
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg glass-sm hover:scale-110 transition-all"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-down glass-sm border-t border-gray-200/50 dark:border-gray-700/50">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors py-2"
            >
              Dashboard
            </Link>
            <Link
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors py-2"
            >
              Analytics
            </Link>
            <Link
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors py-2"
            >
              Documentation
            </Link>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all font-medium shadow-lg">
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}