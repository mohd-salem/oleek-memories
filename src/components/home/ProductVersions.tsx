import Container from '@/components/shared/Container'
import SectionHeading from '@/components/shared/SectionHeading'
import Card from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Image from 'next/image'

const products = [
  {
    id: 'our-wedding-gold',
    title: 'Our Wedding - Gold Foil',
    description: 'Classic elegance in script lettering',
    sizes: ['16GB', '32GB'],
    featured: true,
  },
  {
    id: 'our-wedding-black',
    title: 'Our Wedding - Black Foil',
    description: 'Modern sophistication',
    sizes: ['16GB', '32GB'],
  },
  {
    id: 'we-do',
    title: 'We Do',
    description: 'Romantic cursive on white linen',
    sizes: ['16GB'],
  },
  {
    id: 'always-forever',
    title: 'Always & Forever',
    description: 'Timeless sentiment',
    sizes: ['16GB'],
  },
  {
    id: 'best-day-ever',
    title: 'Best Day Ever',
    description: 'Joyful celebration',
    sizes: ['16GB'],
  },
  {
    id: 'memories',
    title: 'Memories',
    description: 'Simple, versatile',
    sizes: ['16GB'],
  },
]

export default function ProductVersions() {
  return (
    <section className="py-20 bg-cream-100" id="versions">
      <Container>
        <SectionHeading 
          centered
          subheading="All versions feature the same premium quality. Select the cover design that speaks to you."
        >
          Choose Your Style
        </SectionHeading>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {products.map((product) => (
            <Card key={product.id} hoverable className="flex flex-col">
              {/* Fixed height badge container */}
              <div className="h-10 mb-3">
                {product.featured && (
                  <Badge variant="premium">
                    Most Popular
                  </Badge>
                )}
              </div>
              
              {/* Product Image - Fixed height */}
              <div className="relative h-48 mb-4 flex-shrink-0">
                <Image 
                  src="/images/main-image-our-wedding-book.jpg"
                  alt={product.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              
              {/* Content container - grows to fill */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-charcoal-900 mb-2">
                  {product.title}
                </h3>
                
                <p className="text-charcoal-700 mb-3">
                  {product.description}
                </p>
                
                <p className="text-sm text-slate-600 mb-4">
                  Available in: {product.sizes.join(' and ')}
                </p>
                
                {/* Button pushed to bottom */}
                <ButtonLink 
                  href="https://www.amazon.com"
                  external
                  variant="amazon"
                  size="sm"
                  className="w-full mt-auto"
                >
                  View on Amazon
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
