'use client'

import Container from '@/components/shared/Container'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <section className="py-20 bg-cream-50">
      <Container className="max-w-2xl text-center">
        <div className="bg-white border border-charcoal-200 rounded-lg p-12">
          <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-4">
            Something Went Wrong
          </h1>
          
          <p className="text-charcoal-700 mb-8">
            We're sorry, but something unexpected happened. This has been logged and we'll look into it.
          </p>

          {error.message && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-8 text-left">
              <p className="text-sm text-red-800 font-mono">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded font-medium transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-6 py-3 border-2 border-charcoal-800 text-charcoal-800 rounded font-medium hover:bg-cream-50 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
