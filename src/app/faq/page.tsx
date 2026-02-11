import type { Metadata } from 'next'
import Container from '@/components/shared/Container'
import SectionHeading from '@/components/shared/SectionHeading'
import Accordion, { AccordionItem } from '@/components/ui/Accordion'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Common questions about the OLEEK Memories Book, video conversion, compatibility, and support.',
}

// JSON-LD for FAQ schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What memory sizes are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer 16GB (6-8 hours of video) and 32GB (12-15 hours of video) models."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to convert my videos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You should convert if your video is 4K+, 60fps+, or from a professional videographer. Our free converter ensures perfect compatibility."
      }
    }
    // Additional FAQ items would be added here
  ]
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-12 bg-cream-100">
        <Container>
          <SectionHeading centered>
            Frequently Asked Questions
          </SectionHeading>
          <p className="text-center text-lg text-charcoal-700 max-w-3xl mx-auto">
            Everything you need to know about purchasing, using, and maintaining your OLEEK Memories Book.
          </p>
        </Container>
      </section>

      <Container className="py-16 max-w-4xl">
        {/* Product & Purchase */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-charcoal-900 mb-6">
            Product & Purchase
          </h2>
          
          <Accordion>
            <AccordionItem title="What memory sizes are available?">
              <p className="mb-3">We offer two storage options:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>16GB:</strong> Holds approximately 6-8 hours of optimized video</li>
                <li><strong>32GB:</strong> Holds approximately 12-15 hours of optimized video</li>
              </ul>
              <p className="mt-3">Both models have identical features—the only difference is storage capacity.</p>
            </AccordionItem>

            <AccordionItem title="Where can I buy the OLEEK Memories Book?">
              <p className="mb-3">
                We sell exclusively through Amazon. This allows us to offer Prime shipping, easy returns, and the trusted Amazon checkout experience.
              </p>
              <ButtonLink href="https://www.amazon.com/dp/B0G9VL1XFH" external variant="amazon" size="sm">
                Shop on Amazon
              </ButtonLink>
            </AccordionItem>

            <AccordionItem title="What's included in the box?">
              <ul className="list-disc pl-6 space-y-2">
                <li>The video book device</li>
                <li>USB charging/data cable</li>
                <li>Quick start guide</li>
                <li>1-year manufacturer warranty</li>
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                Note: USB power adapter not included (use your phone charger)
              </p>
            </AccordionItem>

            <AccordionItem title="Can I return it if I'm not satisfied?">
              <p>
                Yes. Amazon's 30-day return policy applies. If you're not completely satisfied, you can return it for a full refund. We also offer a 1-year manufacturer warranty for defects.
              </p>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Video Compatibility */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-charcoal-900 mb-6">
            Video Compatibility & Conversion
          </h2>
          
          <Accordion>
            <AccordionItem title="What video formats does it support?">
              <p className="mb-3">
                The device plays <strong>MP4 files with H.264 codec</strong> best. Most modern videos work, but to be safe, we recommend using our <a href="/convert" className="text-gold-600 underline">free converter</a>.
              </p>
              <p className="mt-3">
                <strong>Supported input formats for conversion:</strong><br />
                MP4, MOV, AVI, MKV, WMV, M4V, FLV, WebM
              </p>
            </AccordionItem>

            <AccordionItem title="Do I need to convert my videos?">
              <p className="mb-3"><strong>You should convert if:</strong></p>
              <ul className="list-disc pl-6 mb-3">
                <li>Your video is 4K or higher resolution</li>
                <li>It's shot at 60fps or higher</li>
                <li>File came from professional videographer (often very large)</li>
                <li>You're not sure about the format</li>
              </ul>
              <p className="mb-3"><strong>You probably don't need to convert if:</strong></p>
              <ul className="list-disc pl-6">
                <li>Video is already 1080p MP4 from smartphone</li>
                <li>You've tested it and it plays perfectly</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="Why do you offer a free video converter?">
              <p className="mb-3">Two reasons:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Better experience:</strong> Optimized videos play flawlessly and maximize battery life</li>
                <li><strong>Fewer support requests:</strong> Most playback issues are due to incompatible formats</li>
              </ol>
              <p className="mt-3">
                Unlike competitors who require uploads to servers, our converter runs in your browser—your videos never leave your device.
              </p>
            </AccordionItem>

            <AccordionItem title="How long does video conversion take?">
              <p className="mb-3">Depends on file size and computer speed:</p>
              <ul className="list-disc pl-6">
                <li>Small files (under 500MB): 5-15 minutes</li>
                <li>Medium files (500MB-1GB): 15-30 minutes</li>
                <li>Large files (1GB-2GB): 30-60 minutes</li>
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                Conversion uses your computer's processor, so faster computer = faster conversion.
              </p>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Using the Device */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-charcoal-900 mb-6">
            Using the Device
          </h2>
          
          <Accordion>
            <AccordionItem title="How do I load videos onto the device?">
              <p className="mb-3">It works like a USB flash drive:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Connect device to computer via USB</li>
                <li>Device appears as a drive (like a flash drive)</li>
                <li>Drag and drop videos into the Videos folder</li>
                <li>Safely eject the device</li>
                <li>Open cover and videos play automatically</li>
              </ol>
              <p className="mt-3">
                <a href="/learn" className="text-gold-600 underline">See detailed step-by-step instructions →</a>
              </p>
            </AccordionItem>

            <AccordionItem title="Can I load multiple videos?">
              <p className="mb-3">
                Yes! Load as many as storage allows. They play in alphabetical order by filename.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Pro tip:</strong> Rename files with numbers to control order:<br />
                  01_ceremony.mp4, 02_vows.mp4, 03_reception.mp4
                </p>
              </div>
            </AccordionItem>

            <AccordionItem title="How do I control playback?">
              <p className="mb-3"><strong>Automatic:</strong></p>
              <ul className="list-disc pl-6 mb-3">
                <li>Open cover → video plays</li>
                <li>Close cover → video pauses</li>
              </ul>
              <p className="mb-3"><strong>Manual controls:</strong></p>
              <p>
                Small buttons on the side allow play/pause, skip forward/backward, and volume adjustment. See quick start guide for exact button layout.
              </p>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Battery & Charging */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-charcoal-900 mb-6">
            Battery & Charging
          </h2>
          
          <Accordion>
            <AccordionItem title="How long does the battery last?">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Continuous playback:</strong> Up to 8 hours on full charge</li>
                <li><strong>Standby time:</strong> Over 1 year if not in use</li>
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                Battery life gradually decreases over 2-3 years (normal for all rechargeable batteries)
              </p>
            </AccordionItem>

            <AccordionItem title="How do I charge it?">
              <p className="mb-3">
                Use the included USB cable and any USB power adapter (like your phone charger).
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Charging time: 3-4 hours for full charge</li>
                <li>Red light = charging</li>
                <li>Green light = fully charged</li>
              </ul>
              <p className="mt-3">You can also charge via computer USB port (takes longer).</p>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Technical & Support */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-charcoal-900 mb-6">
            Support & Privacy
          </h2>
          
          <Accordion>
            <AccordionItem title="Do you store or access my videos?">
              <p className="mb-3">
                <strong>No.</strong> When you use our video converter, all processing happens in your browser. Your videos never leave your computer.
              </p>
              <p>
                This is different from competitors who require uploading to servers. We designed our converter specifically to protect your privacy.
              </p>
            </AccordionItem>

            <AccordionItem title="What if my device stops working?">
              <p className="mb-3">
                All devices come with a 1-year manufacturer warranty. If your device has a defect within the first year, contact us for replacement.
              </p>
              <p>
                For issues beyond warranty, our support team will help troubleshoot and discuss repair/replacement options.
              </p>
            </AccordionItem>

            <AccordionItem title="How do I contact support?">
              <p>
                Visit our <a href="/contact" className="text-gold-600 underline">Contact page</a> to submit a request or email our team. We typically respond within 1 business day.
              </p>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center bg-gold-50 border border-gold-200 rounded-lg p-8">
          <h3 className="text-2xl font-display font-bold text-charcoal-900 mb-4">
            Still Have Questions?
          </h3>
          <p className="text-charcoal-700 mb-6">
            Contact our support team for personalized assistance.
          </p>
          <ButtonLink href="/contact" variant="primary">
            Contact Us
          </ButtonLink>
        </div>
      </Container>
    </>
  )
}
