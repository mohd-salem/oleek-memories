import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import FeatureGrid from '@/components/home/FeatureGrid'
import ProductVersions from '@/components/home/ProductVersions'
import Testimonials from '@/components/home/Testimonials'
import ConverterCTA from '@/components/home/ConverterCTA'

// Page-specific metadata
export const metadata: Metadata = {
  title: 'Premium Wedding Video Keepsake',
  description: 'A linen-bound video album with a 7" HD screen. Store up to 12 hours of wedding footage. Simply open the cover and your memories come to life.',
  openGraph: {
    title: 'OLEEK Memories Book | Premium Wedding Video Keepsake',
    description: 'A linen-bound video album with a 7" HD screen. Your wedding memories, beautifully preserved.',
  },
}

// Add JSON-LD structured data for SEO
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "OLEEK Memories Book",
  "description": "Premium video album with 7-inch HD screen for wedding memories",
  "brand": {
    "@type": "Brand",
    "name": "OLEEK"
  },
  "offers": {
    "@type": "AggregateOffer",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "OLEEK"
    }
  }
}

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <Hero />
      <FeatureGrid />
      <ProductVersions />
      <Testimonials />
      <ConverterCTA />
    </>
  )
}
