import type { Metadata } from 'next'
import Container from '@/components/shared/Container'
import SectionHeading from '@/components/shared/SectionHeading'
import Accordion, { AccordionItem } from '@/components/ui/Accordion'
import { ButtonLink } from '@/components/ui/Button'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Use Your Memories Book',
  description: 'Step-by-step guide for loading videos, best settings, and troubleshooting your OLEEK Memories Book.',
}

export default function LearnPage() {
  return (
    <>
      <section className="py-12 bg-cream-100">
        <Container>
          <SectionHeading centered>
            How to Use Your OLEEK Memories Book
          </SectionHeading>
          <p className="text-center text-lg text-charcoal-700 max-w-3xl mx-auto">
            Everything you need to know about loading videos, maintaining your device, and getting the best experience.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        {/* Loading Videos Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-charcoal-900 mb-6">
            Loading Videos (Step-by-Step)
          </h2>
          
          <div className="space-y-6 prose prose-lg max-w-none">
            <div className="bg-cream-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-gold-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                Charge Your Device (First Time)
              </h3>
              <p className="text-charcoal-700 mb-3">
                Connect the USB cable to the charging port and plug into a USB power adapter. The indicator light will show red while charging, green when complete. First charge takes 3-4 hours.
              </p>
            </div>

            <div className="bg-cream-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-gold-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                Connect to Your Computer
              </h3>
              <p className="text-charcoal-700 mb-3">
                Close the device cover, connect the USB cable to your computer. Wait 10-15 seconds for recognition.
              </p>
              <ul className="list-disc pl-6 text-charcoal-700 space-y-1">
                <li><strong>Mac:</strong> A drive icon labeled "OLEEK" appears on desktop</li>
                <li><strong>PC:</strong> Device appears in File Explorer under "This PC"</li>
              </ul>
            </div>

            <div className="bg-cream-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-gold-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                Copy Your Video Files
              </h3>
              <p className="text-charcoal-700 mb-3">
                Drag and drop your video files into the device folder (usually "DCIM" or "Videos"). A 2GB video typically takes 2-5 minutes to copy.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-3">
                <p className="text-sm text-blue-900">
                  <strong>Pro tip:</strong> Rename files with numbers (01_ceremony.mp4, 02_reception.mp4) to control playback order.
                </p>
              </div>
            </div>

            <div className="bg-cream-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-gold-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
                Safely Eject the Device
              </h3>
              <p className="text-charcoal-700 mb-3">
                <strong>Important:</strong> Don't just unplug! Use "Safely Remove Hardware" (PC) or "Eject" (Mac) to prevent file corruption.
              </p>
            </div>

            <div className="bg-cream-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-gold-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">5</span>
                Test Playback
              </h3>
              <p className="text-charcoal-700">
                Disconnect from computer, ensure device is charged (at least 20%), and open the cover. Your video should start playing automatically within 2-3 seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Best Video Settings */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-charcoal-900 mb-6">
            Best Video Settings
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recommended Settings
              </h3>
              <ul className="space-y-2 text-sm text-green-900">
                <li>✓ Resolution: 1080p (1920×1080)</li>
                <li>✓ Format: MP4 with H.264 codec</li>
                <li>✓ Frame rate: 30 fps</li>
                <li>✓ Aspect ratio: 16:9</li>
                <li>✓ Audio: AAC, 128 kbps</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Avoid These Settings
              </h3>
              <ul className="space-y-2 text-sm text-red-900">
                <li>✗ 4K or higher resolution (wastes storage)</li>
                <li>✗ 60 fps or higher (drains battery)</li>
                <li>✗ Vertical video (large black bars)</li>
                <li>✗ Very old formats (WMV, AVI from 2000s)</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-6">
            <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              When to Convert Your Videos
            </h3>
            <p className="text-yellow-900 mb-3">
              Use our <a href="/convert" className="underline font-semibold">free converter</a> if your video is:
            </p>
            <ul className="list-disc pl-6 text-yellow-900 space-y-1">
              <li>4K or higher resolution</li>
              <li>Shot at 60fps or higher</li>
              <li>Very large file size (over 5GB for 1 hour)</li>
              <li>Won't play when tested on device</li>
            </ul>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-charcoal-900 mb-6">
            Common Mistakes to Avoid
          </h2>
          
          <Accordion>
            <AccordionItem title="Not Safely Ejecting the Device">
              <p className="mb-3">
                <strong>Problem:</strong> Unplugging without ejecting can corrupt your video files.
              </p>
              <p className="mb-3">
                <strong>Solution:</strong> Always use "Safely Remove Hardware" (PC) or "Eject" (Mac) before unplugging.
              </p>
              <p>
                <strong>How to tell if corrupted:</strong> Video won't play, file size shows 0 bytes, or error when opening.
              </p>
            </AccordionItem>

            <AccordionItem title="Letting Battery Fully Drain">
              <p className="mb-3">
                <strong>Problem:</strong> Repeatedly draining to 0% reduces battery lifespan.
              </p>
              <p>
                <strong>Solution:</strong> Charge when it reaches 20-30% rather than waiting for it to die completely.
              </p>
            </AccordionItem>

            <AccordionItem title="Using Incompatible Video Formats">
              <p className="mb-3">
                <strong>Problem:</strong> Loading unconverted 4K videos or unusual formats results in playback errors.
              </p>
              <p>
                <strong>Solution:</strong> Use our <a href="/convert" className="underline text-gold-600">free converter</a> to ensure compatibility.
              </p>
            </AccordionItem>

            <AccordionItem title="Filling Storage to 100%">
              <p className="mb-3">
                <strong>Problem:</strong> No free space can cause playback issues.
              </p>
              <p>
                <strong>Solution:</strong> Leave at least 500MB-1GB free. Check storage by viewing device properties on your computer.
              </p>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Troubleshooting */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-charcoal-900 mb-6">
            Troubleshooting
          </h2>
          
          <Accordion>
            <AccordionItem title='"No Files Found" Error'>
              <p className="mb-3">
                <strong>Possible causes:</strong>
              </p>
              <ul className="list-disc pl-6 mb-3">
                <li>Videos in wrong folder</li>
                <li>Incompatible file format</li>
                <li>Special characters in filename</li>
              </ul>
              <p>
                <strong>Solutions:</strong> Ensure videos are in "Videos" or "DCIM" folder, convert files using our tool, and rename to simple names (e.g., "wedding.mp4").
              </p>
            </AccordionItem>

            <AccordionItem title="Video Stutters or Freezes">
              <p className="mb-3">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc pl-6">
                <li>Charge the device fully (performance drops below 10%)</li>
                <li>Convert the video to optimize bitrate</li>
                <li>Let device cool down if it feels warm</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="Device Won't Turn On">
              <p className="mb-3">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc pl-6">
                <li>Charge for at least 30 minutes before trying</li>
                <li>Press and hold power button for 10 seconds (force restart)</li>
                <li>If still not working, contact our support team</li>
              </ul>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center bg-gold-50 border border-gold-200 rounded-lg p-8">
          <h3 className="text-2xl font-display font-bold text-charcoal-900 mb-4">
            Need More Help?
          </h3>
          <p className="text-charcoal-700 mb-6">
            Check our FAQ or contact support for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink href="/faq" variant="secondary">
              View FAQ
            </ButtonLink>
            <ButtonLink href="/contact" variant="primary">
              Contact Support
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  )
}
