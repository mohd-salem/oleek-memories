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
    image: '/images/cover-our-wedding.png',
    sizes: [
      { size: '16GB', asin: 'B0G9VL1XFH' },
      { size: '32GB', asin: 'B0GCL1S48L' },
    ],
    featured: true,
  },
  // {
  //   id: 'our-wedding-black',
  //   title: 'Our Wedding - Black Foil',
  //   description: 'Modern sophistication',
  //   image: '/images/cover-our-wedding-black.png',
  //   sizes: ['16GB', '32GB'],
  // },
  {
    id: 'we-do',
    title: 'We Do',
    description: 'Romantic cursive on white linen',
    image: '/images/cover-WE-DO.png',
    sizes: [{ size: '16GB', asin: 'B0GCK92CPQ' }],
  },
  {
    id: 'always-forever',
    title: 'Always & Forever',
    description: 'Timeless sentiment',
    image: '/images/cover-always-forever.png',
    sizes: [{ size: '16GB', asin: 'B0GCKPW1BY' }],
  },
  // {
  //   id: 'best-day-ever',
  //   title: 'Best Day Ever',
  //   description: 'Joyful celebration',
  //   image: '/images/cover-1.png',
  //   sizes: [{ size: '16GB', asin: '' }],
  // },
  {
    id: 'memories',
    title: 'Memories',
    description: 'Simple, versatile',
    image: '/images/cover-memories.png',
    sizes: [{ size: '16GB', asin: 'B0GCKPGQYD' }],
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
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain rounded"
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
                  Available in: {product.sizes.map(s => s.size).join(' and ')}
                </p>
                
                {/* Buttons pushed to bottom */}
                <div className="mt-auto space-y-2">
                  {product.sizes.length === 1 ? (
                    <ButtonLink 
                      href={product.sizes[0].asin ? `https://www.amazon.com/dp/${product.sizes[0].asin}` : 'https://www.amazon.com/oleek'}
                      external
                      variant="amazon"
                      size="sm"
                      className="w-full"
                    >
                      View on Amazon
                    </ButtonLink>
                  ) : (
                    product.sizes.map((item) => (
                      <ButtonLink 
                        key={item.size}
                        href={item.asin ? `https://www.amazon.com/dp/${item.asin}` : 'https://www.amazon.com/oleek'}
                        external
                        variant="amazon"
                        size="sm"
                        className="w-full"
                      >
                        View {item.size} on Amazon
                      </ButtonLink>
                    ))
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
