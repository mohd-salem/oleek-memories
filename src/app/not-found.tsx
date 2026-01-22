import Container from '@/components/shared/Container'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="py-20 bg-cream-50">
      <Container className="max-w-2xl text-center">
        <div className="bg-white border border-charcoal-200 rounded-lg p-12">
          <FileQuestion className="h-16 w-16 text-slate-400 mx-auto mb-6" />
          
          <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-charcoal-700 mb-8">
            Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded font-medium transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/convert"
              className="px-6 py-3 border-2 border-charcoal-800 text-charcoal-800 rounded font-medium hover:bg-cream-50 transition-colors"
            >
              Convert Videos
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-charcoal-200">
            <p className="text-sm text-slate-600 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <Link href="/learn" className="text-gold-600 hover:text-gold-700 underline">
                Loading Guide
              </Link>
              <Link href="/faq" className="text-gold-600 hover:text-gold-700 underline">
                FAQ
              </Link>
              <Link href="/terms" className="text-gold-600 hover:text-gold-700 underline">
                Terms
              </Link>
              <Link href="/contact" className="text-gold-600 hover:text-gold-700 underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
