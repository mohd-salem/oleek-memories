import Container from '@/components/shared/Container'
import { ButtonLink } from '@/components/ui/Button'
import { Shield, Zap, Check } from 'lucide-react'

export default function ConverterCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-cream-100">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Free • Secure • Lightning Fast</span>
          </div>
          
          <h2 className="text-4xl font-display font-bold text-charcoal-900 mb-6">
            Need to Convert Your Videos First?
          </h2>
          
          <p className="text-lg text-charcoal-700 mb-8 leading-relaxed">
            Most wedding videos from professional videographers need optimization to play perfectly on your Memories Book. Use our professional conversion tool to ensure flawless playback in seconds.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center">
              <div className="bg-gold-100 p-3 rounded-full mb-3">
                <Shield className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="font-semibold text-charcoal-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-sm text-charcoal-700">
                Files auto-delete after 24 hours—your memories stay yours
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gold-100 p-3 rounded-full mb-3">
                <Zap className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="font-semibold text-charcoal-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-charcoal-700">
                Professional cloud conversion in ~30 seconds
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gold-100 p-3 rounded-full mb-3">
                <Check className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="font-semibold text-charcoal-900 mb-2">
                Perfect Compatibility
              </h3>
              <p className="text-sm text-charcoal-700">
                Converts to exact specs your device needs
              </p>
            </div>
          </div>
          
          <ButtonLink 
            href="/convert"
            variant="primary"
            size="lg"
          >
            Convert Your Videos Now →
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
