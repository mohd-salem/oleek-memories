import Container from '@/components/shared/Container'
import SectionHeading from '@/components/shared/SectionHeading'
import Card from '@/components/ui/Card'
import { HardDrive, Battery, Usb, Play, Sparkles, Clock, Shield } from 'lucide-react'

const features = [
  {
    icon: HardDrive,
    title: 'Generous Storage',
    description: 'Store up to 12 hours of wedding footage with 16GB or 32GB models. No need to edit down to highlights—keep everything.',
  },
  {
    icon: Battery,
    title: 'Extended Battery',
    description: '8 hours of continuous playback with 5000mAh battery. Over a year of standby time between charges.',
  },
  {
    icon: Play,
    title: 'Instant Playback',
    description: 'Opens like a book, plays like magic. Automatic video playback the moment you open the cover.',
  },
  {
    icon: Usb,
    title: 'Plug-and-Play',
    description: 'Works like a USB flash drive. Drag and drop videos—no software required. Compatible with Mac and PC.',
  },
  {
    icon: Sparkles,
    title: 'Premium Linen Cover',
    description: 'Elegant design with foil stamping. Built to look beautiful on your coffee table for decades.',
  },
  {
    icon: Clock,
    title: 'HD Display',
    description: '1024×600 resolution, 7-inch screen with built-in speakers. Clear, vibrant video quality.',
  },
  {
    icon: Shield,
    title: 'Free Video Converter',
    description: 'Professional cloud-powered tool converts videos in seconds. Secure processing with automatic 24-hour deletion.',
  },
]

export default function FeatureGrid() {
  return (
    <section className="py-20" id="features">
      <Container>
        <SectionHeading 
          centered
          subheading="Everything you need to preserve and relive your most precious memories"
        >
          Why Choose OLEEK?
        </SectionHeading>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} variant="feature">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gold-100 p-4 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-gold-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
