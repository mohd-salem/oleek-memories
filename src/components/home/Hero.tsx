import Container from '@/components/shared/Container'
import { ButtonLink } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-cream-50 to-cream-100">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <Badge variant="premium" className="mb-6">
              Premium Wedding Keepsake
            </Badge>
            
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-charcoal-900 mb-6 leading-tight">
              Your Wedding Video, Turned Into a Memory Book
            </h1>
            
            <p className="text-xl text-charcoal-700 mb-8 leading-relaxed">
              Open the linen cover and your wedding memories come to life instantly on the 7" HD screen — no setup, no software. Just your special day, ready to relive anytime.
From your first look to your last dance, every moment is saved inside.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <ButtonLink 
                href="https://www.amazon.com/dp/B0G9VL1XFH"
                external
                variant="amazon"
                size="lg"
              >
                Buy on Amazon
              </ButtonLink>
              
              <ButtonLink 
                href="/convert"
                variant="secondary"
                size="lg"
              >
                Convert Your Videos
              </ButtonLink>
            </div>
            
            <p className="mt-6 text-sm text-slate-500">
              ✓ Prime Eligible &nbsp;•&nbsp; ✓ 30-Day Returns &nbsp;•&nbsp; ✓ 1-Year Warranty
            </p>
          </div>
          
          {/* Right: Product Image */}
          <div className="relative h-64 md:h-80">
            <Image 
              src="/images/cover-11.jpg"
              alt="OLEEK Memories Book - Our Wedding video album open and playing"
              fill
              priority
              className="rounded-lg shadow-xl object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
