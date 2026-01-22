import Link from 'next/link'
import Container from '@/components/shared/Container'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerSections = {
    product: {
      title: 'Product',
      links: [
        { label: 'Shop on Amazon', href: 'https://www.amazon.com', external: true as const },
        { label: 'Product Versions', href: '/#versions', external: false as const },
        { label: 'Features', href: '/#features', external: false as const },
      ],
    },
    resources: {
      title: 'Resources',
      links: [
        { label: 'Convert Videos', href: '/convert', external: false as const },
        { label: 'How to Use', href: '/learn', external: false as const },
        { label: 'FAQ', href: '/faq', external: false as const },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact', external: false as const },
        { label: 'Terms & Conditions', href: '/terms', external: false as const },
      ],
    },
  }
  
  return (
    <footer className="bg-cream-100 border-t border-cream-200 mt-20">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-display font-bold text-charcoal-900 mb-4">
              OLEEK
            </h3>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              Where memories become heirlooms.
            </p>
          </div>
          
          {/* Links Columns */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-charcoal-900 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-charcoal-700 hover:text-gold-500 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-charcoal-700 hover:text-gold-500 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-cream-200 py-6 text-center text-sm text-charcoal-700">
          <p>
            © {currentYear} OLEEK. Small business brand. Made with care for preserving memories.
          </p>
        </div>
      </Container>
    </footer>
  )
}
