import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import QueryProvider from '@/components/providers/QueryProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SEO Performance Analyzer',
  description: 'Analyze your website\'s SEO performance with AI-powered insights',
  keywords: 'SEO, website analysis, performance, AI insights',
  authors: [{ name: 'SEO Analyzer Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={poppins.className}>
        <ThemeProvider defaultTheme="dark">
          <QueryProvider>
            <div className="min-h-screen">
              <Header />
              <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}