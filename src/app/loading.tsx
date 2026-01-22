import Container from '@/components/shared/Container'

export default function Loading() {
  return (
    <section className="py-20">
      <Container className="max-w-2xl">
        <div className="animate-pulse space-y-8">
          {/* Header skeleton */}
          <div className="space-y-3">
            <div className="h-12 bg-cream-200 rounded w-3/4 mx-auto" />
            <div className="h-6 bg-cream-200 rounded w-1/2 mx-auto" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-64 bg-cream-200 rounded" />
            <div className="h-40 bg-cream-200 rounded" />
          </div>
        </div>
      </Container>
    </section>
  )
}
