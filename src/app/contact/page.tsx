import type { Metadata } from 'next'
import Container from '@/components/shared/Container'
import SectionHeading from '@/components/shared/SectionHeading'
import { ButtonLink } from '@/components/ui/Button'
import { Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with OLEEK support team for help with your Memories Book or video conversion.',
}

export default function ContactPage() {
  return (
    <>
      <section className="py-12 bg-cream-100">
        <Container>
          <SectionHeading centered>
            Contact Us
          </SectionHeading>
          <p className="text-center text-lg text-charcoal-700 max-w-2xl mx-auto">
            We're here to help with your OLEEK Memories Book
          </p>
        </Container>
      </section>

      <Container className="py-16 max-w-3xl">
        <div className="bg-cream-100 border border-cream-200 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-gold-100 p-3 rounded-full">
              <Mail className="h-6 w-6 text-gold-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-charcoal-900 mb-2">
                Email Support
              </h3>
              <p className="text-charcoal-700 mb-3">
                For technical support, product questions, or assistance with video conversion, email us at:
              </p>
              <a 
                href="mailto:support@oleek.com" 
                className="text-gold-600 hover:text-gold-700 font-medium text-lg"
              >
                support@oleek.com
              </a>
              <p className="text-sm text-slate-600 mt-2">
                We typically respond within 1 business day.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              Before You Contact Us
            </h3>
            <p className="text-sm text-blue-900 mb-3">
              Check if your question is already answered:
            </p>
            <div className="space-y-2">
              <ButtonLink href="/faq" variant="secondary" size="sm" className="w-full">
                View FAQ
              </ButtonLink>
              <ButtonLink href="/learn" variant="secondary" size="sm" className="w-full">
                How-To Guide
              </ButtonLink>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">
              Common Issues
            </h3>
            <ul className="text-sm text-green-900 space-y-2">
              <li>• "No Files Found" error → <a href="/learn#troubleshooting" className="underline">Troubleshooting</a></li>
              <li>• Video won't convert → <a href="/convert" className="underline">Try converter</a></li>
              <li>• Battery issues → <a href="/learn#battery" className="underline">Battery care</a></li>
              <li>• Device won't turn on → <a href="/faq" className="underline">See FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="bg-cream-100 border border-cream-200 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-charcoal-900 mb-4">
            What to Include in Your Email
          </h3>
          <p className="text-charcoal-700 mb-3">
            To help us assist you faster, please include:
          </p>
          <ul className="list-disc pl-6 text-charcoal-700 space-y-2">
            <li><strong>Device model:</strong> 16GB or 32GB, cover design</li>
            <li><strong>Purchase date:</strong> Approximate month/year</li>
            <li><strong>Issue description:</strong> What's happening and when it started</li>
            <li><strong>Video details:</strong> File format, size, source (if conversion issue)</li>
            <li><strong>Steps you've tried:</strong> What troubleshooting you've done</li>
          </ul>
        </div>

        <div className="mt-8 text-center bg-gold-50 border border-gold-200 rounded-lg p-8">
          <h3 className="text-2xl font-display font-bold text-charcoal-900 mb-4">
            For Amazon Orders
          </h3>
          <p className="text-charcoal-700 mb-6">
            For order status, returns, or shipping questions, please contact Amazon customer service directly through your order page.
          </p>
          <ButtonLink href="https://www.amazon.com/orders" external variant="amazon">
            View Amazon Orders
          </ButtonLink>
        </div>
      </Container>
    </>
  )
}
