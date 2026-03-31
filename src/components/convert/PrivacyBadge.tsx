import { Shield } from 'lucide-react'

export default function PrivacyBadge() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="bg-green-500 p-3 rounded-full flex-shrink-0">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-green-900 text-lg mb-2">
            Your Privacy Is Protected
          </h3>
          <p className="text-green-800 text-sm leading-relaxed">
            Your video is uploaded to secure, private AWS cloud storage for processing. We never view, share, or retain your files — uploaded videos are automatically and permanently deleted within 24 hours.
          </p>
        </div>
      </div>
    </div>
  )
}
