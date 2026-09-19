import Link from 'next/link'
import Container from '@/components/shared/Container'
import { ButtonLink } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Image from 'next/image'
import { ArrowRight, FileVideo2, Scissors, ShoppingBag } from 'lucide-react'

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
            
            <p className="text-xl text-charcoal-700 mb-6 leading-relaxed">
              Open the linen cover and your wedding memories come to life instantly on the 7" HD screen — no setup, no software. Just your special day, ready to relive anytime.
From your first look to your last dance, every moment is saved inside.
            </p>

            {/* Callout: large-file support, addresses top user complaint */}
            <Link
              href="/split"
              className="group inline-flex items-center gap-3 mb-8 bg-amazon/10 border-2 border-amazon rounded-lg px-4 py-3 hover:bg-amazon/20 transition-colors focus-ring"
            >
              <Scissors className="h-6 w-6 text-amazon-dark shrink-0" />
              <span className="text-charcoal-900 font-semibold">
                Video over 5 GB? <span className="text-amazon-dark">We&apos;ll split &amp; convert it free</span>
              </span>
              <ArrowRight className="h-5 w-5 text-amazon-dark transition-transform group-hover:translate-x-1" />
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <ButtonLink 
                href="https://www.amazon.com/dp/B0G9VL1XFH"
                external
                variant="amazon"
                size="lg"
                className="flex flex-1 items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Buy on Amazon</span>
              </ButtonLink>
              
              <ButtonLink 
                href="/convert"
                variant="secondary"
                size="lg"
                className="flex flex-1 items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
              >
                <FileVideo2 className="h-5 w-5" />
                <span className="flex flex-col items-start leading-tight">
                  <span>Convert Your Videos</span>
                  <span className="text-xs font-normal text-charcoal-700">For videos under 5 GB</span>
                </span>
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
