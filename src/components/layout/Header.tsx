'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Container from '@/components/shared/Container'
import { trackAmazonClick } from '@/lib/utils/analytics'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navLinks = [
    { href: '/convert', label: 'Convert Video' },
    { href: '/learn', label: 'Learn' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]
  
  return (
    <header className="bg-cream-50 border-b border-cream-200 sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="focus-ring rounded flex items-center">
            <Image 
              src="/images/oleek-logo-for-web.png"
              alt="OLEEK"
              width={120}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-charcoal-700 hover:text-gold-500 transition-colors font-medium focus-ring rounded px-2 py-1"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Primary CTA - Amazon */}
            <a
              href="https://www.amazon.com/dp/B0G9VL1XFH" // Update with actual Amazon link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAmazonClick('header')}
              className="bg-amazon hover:bg-amazon-dark text-white px-6 py-2 rounded font-medium transition-colors focus-ring"
            >
              Buy on Amazon
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden focus-ring rounded p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-charcoal-800" />
            ) : (
              <Menu className="h-6 w-6 text-charcoal-800" />
            )}
          </button>
        </nav>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-charcoal-700 hover:text-gold-500 transition-colors font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.amazon.com/dp/B0G9VL1XFH" // Update with actual Amazon link
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amazon hover:bg-amazon-dark text-white px-6 py-3 rounded font-medium transition-colors text-center"
              >
                Buy on Amazon
              </a>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
