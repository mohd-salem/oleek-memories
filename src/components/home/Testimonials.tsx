import Container from '@/components/shared/Container'
import SectionHeading from '@/components/shared/SectionHeading'
import Card from '@/components/ui/Card'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: "We spent $3,000 on our wedding videographer, and this is the only way we actually watch it. Our parents love that they can just open it and see our ceremony again.",
    author: "Sarah & Mike",
    occasion: "Married June 2025",
    rating: 5,
  },
  {
    quote: "The battery life is incredible. We took it to our one-month anniversary dinner and watched our vows over dessert. Still had 60% battery left.",
    author: "Priya & James",
    occasion: "Married August 2025",
    rating: 5,
  },
  {
    quote: "My mom isn't tech-savvy at all, but she uses this constantly. No complicated setup—just open and watch. It's perfect.",
    author: "Emily",
    occasion: "Daughter of the Bride",
    rating: 5,
  },
  {
    quote: "Better storage than the other video books I researched. We fit our entire 4-hour ceremony and reception video plus highlight reels.",
    author: "David & Michelle",
    occasion: "Married December 2025",
    rating: 5,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-3">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading centered>
          Loved by Couples Everywhere
        </SectionHeading>
        
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="testimonial">
              <StarRating rating={testimonial.rating} />
              
              <blockquote className="text-charcoal-700 leading-relaxed mb-4 italic font-display text-lg">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="text-sm">
                <p className="font-semibold text-charcoal-900">
                  {testimonial.author}
                </p>
                <p className="text-slate-600">
                  {testimonial.occasion}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
