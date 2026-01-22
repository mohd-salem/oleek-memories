import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Font optimization - Next.js automatically optimizes and self-hosts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Prevents invisible text during font load
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '800'],
  display: 'swap',
})

// Root metadata - provides defaults for all pages
export const metadata: Metadata = {
  metadataBase: new URL('https://www.oleek.com'), // Update with actual domain
  title: {
    default: 'OLEEK Memories Book | Premium Wedding Video Keepsake',
    template: '%s | OLEEK Memories Book',
  },
  description: 'A premium video album with a 7" HD screen. Simply open the cover and your wedding memories come to life—no setup, no software, no complexity.',
  keywords: ['wedding video book', 'video keepsake', 'wedding gift', 'video album', 'memories book', 'premium wedding gift'],
  authors: [{ name: 'OLEEK' }],
  creator: 'OLEEK',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.oleek.com',
    siteName: 'OLEEK Memories Book',
    title: 'OLEEK Memories Book | Premium Wedding Video Keepsake',
    description: 'A premium video album with a 7" HD screen. Your wedding memories, beautifully preserved.',
    images: [
      {
        url: '/og-image.jpg', // Create this image (1200x630)
        width: 1200,
        height: 630,
        alt: 'OLEEK Memories Book',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OLEEK Memories Book | Premium Wedding Video Keepsake',
    description: 'A premium video album with a 7" HD screen. Your wedding memories, beautifully preserved.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
