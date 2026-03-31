import type { Metadata } from 'next'
import Container from '@/components/shared/Container'
import SectionHeading from '@/components/shared/SectionHeading'

export const metadata: Metadata = {
  title: 'Terms & Conditions - Video Conversion Service',
  description: 'Terms and conditions for using the OLEEK video conversion service.',
}

export default function TermsPage() {
  return (
    <>
      <section className="py-12 bg-cream-100">
        <Container>
          <SectionHeading centered>
            Terms & Conditions
          </SectionHeading>
          <p className="text-center text-charcoal-700 max-w-2xl mx-auto">
            Video Conversion Service Only
          </p>
        </Container>
      </section>

      <Container className="py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-slate-600 mb-8">
            <strong>Effective Date:</strong> January 21, 2026<br />
            <strong>Last Updated:</strong> January 21, 2026
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By using the OLEEK video conversion service (the "Service"), you agree to these Terms & Conditions. If you do not agree, please do not use the Service.
          </p>
          <p>
            These terms apply <strong>only to the video conversion tool</strong> on this website. For terms related to purchasing the OLEEK Memories Book device, refer to Amazon's terms and conditions.
          </p>

          <h2>2. Description of Service</h2>
          <p>The Service provides free, cloud-based video conversion powered by AWS (Amazon Web Services).</p>
          
          <p><strong>What the Service does:</strong></p>
          <ul>
            <li>Converts video files to MP4 format optimized for OLEEK Memories Book devices</li>
            <li>Securely uploads your video to private AWS S3 storage for cloud processing</li>
            <li>Automatically and permanently deletes your uploaded video within 24 hours</li>
            <li>Outputs videos with specific technical specifications (H.264 codec, up to 1080p, 30fps, etc.)</li>
          </ul>
          
          <p><strong>What the Service does NOT do:</strong></p>
          <ul>
            <li>Retain your video files after the 24-hour auto-deletion window</li>
            <li>Collect or view your video content</li>
            <li>Guarantee specific conversion times or results for all files</li>
          </ul>

          <h2>3. Ownership & Permitted Use</h2>
          
          <h3>Your Content</h3>
          <p>
            You retain full ownership of all video files you convert using the Service. We do not claim any rights to your videos.
          </p>
          
          <p><strong>You represent and warrant that:</strong></p>
          <ul>
            <li>You own the video content or have explicit permission to convert it</li>
            <li>The video does not violate third-party copyrights or intellectual property rights</li>
            <li>You have obtained necessary permissions from individuals appearing in the video</li>
            <li>The video does not contain illegal, harmful, or obscene content</li>
          </ul>

          <h3>Prohibited Uses</h3>
          <p>You may NOT use the Service to:</p>
          <ul>
            <li>Convert videos you don't own or lack permission to use</li>
            <li>Process copyrighted content without authorization (e.g., pirated movies)</li>
            <li>Convert content that violates any laws or regulations</li>
            <li>Attempt to reverse-engineer or exploit the Service</li>
          </ul>

          <h2>4. Privacy & Data Collection</h2>
          
          <h3>What We DON’T Do With Your Video</h3>
          <p>
            Your video is uploaded to a <strong>secure, private AWS S3 bucket</strong> solely for the purpose of conversion. We do not:
          </p>
          <ul>
            <li>View, review, or access your video content</li>
            <li>Store your video in any permanent cloud service</li>
            <li>Share your video with any third parties</li>
            <li>Use your video for any purpose other than conversion</li>
          </ul>
          <p>
            <strong>All uploaded files are automatically and permanently deleted within 24 hours</strong>, regardless of whether conversion completes.
          </p>

          <h3>What We MAY Collect</h3>
          <p>For basic website analytics, we may collect:</p>
          <ul>
            <li>Anonymous usage statistics (number of conversions, browser type)</li>
            <li>Error logs (to improve the tool)</li>
            <li>Page visit data</li>
          </ul>
          <p className="text-sm text-slate-600">
            We do NOT collect personal information unless you voluntarily contact us.
          </p>

          <h2>5. No Warranties</h2>
          <p>
            The Service is provided <strong>"as-is" and "as available"</strong> without warranties of any kind.
          </p>
          
          <p><strong>We do NOT guarantee:</strong></p>
          <ul>
            <li>100% uptime or availability</li>
            <li>Successful conversion for all video files</li>
            <li>Error-free or defect-free output</li>
            <li>Specific conversion times (varies by device and file size)</li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, OLEEK shall not be liable for:
          </p>
          <ul>
            <li>Loss of video files or data</li>
            <li>Corruption of original files</li>
            <li>Failed conversions or poor-quality output</li>
            <li>Indirect damages (loss of business, revenue, or profits)</li>
          </ul>
          
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg my-6">
            <p className="font-semibold mb-2">Your Responsibility:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Back up original video files before conversion</li>
              <li>Verify converted video quality before deleting originals</li>
              <li>Ensure your device/browser is compatible</li>
            </ul>
          </div>

          <h2>7. Technical Limitations</h2>
          
          <h3>File Size Limits</h3>
          <p>
            The Service is optimized for files up to <strong>5GB</strong>. Larger files may fail or encounter errors. We are not responsible for failed conversions due to file size limitations.
          </p>

          <h3>Cloud Processing</h3>
          <p>
            Video conversion runs on AWS cloud infrastructure. You acknowledge that:
          </p>
          <ul>
            <li>Upload speed depends on your internet connection</li>
            <li>Large files (up to 5 GB) may take 30–90 minutes to convert</li>
            <li>Conversion results are available for download for 24 hours</li>
          </ul>

          <h2>8. Modifications</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service at any time. We may update these Terms & Conditions—changes will be posted with a new "Last Updated" date.
          </p>
          <p>
            Continued use of the Service after changes constitutes acceptance of updated terms.
          </p>

          <h2>9. Contact Information</h2>
          <p>
            Questions about these Terms? <a href="/contact" className="text-gold-600 underline">Contact us</a>.
          </p>

          <div className="bg-cream-100 border border-cream-200 p-6 rounded-lg mt-12">
            <h3 className="font-semibold text-charcoal-900 mb-3">Summary (Not Legally Binding)</h3>
            <p className="text-sm mb-3">In simple terms:</p>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>✓ You own your videos—we never retain them</li>
              <li>✓ Videos are processed securely in the cloud and auto-deleted within 24 hours</li>
              <li>✓ Use for legal, personal purposes only</li>
              <li>✓ Service provided "as-is"—no guarantees</li>
              <li>✓ Back up originals before converting</li>
              <li>✓ Don't convert copyrighted content you don't own</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  )
}
