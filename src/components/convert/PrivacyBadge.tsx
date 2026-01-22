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
            Your Videos Never Leave Your Device
          </h3>
          <p className="text-green-800 text-sm leading-relaxed">
            Unlike other services that upload your intimate wedding videos to cloud servers, our converter processes everything locally in your browser. We never see, access, or store your files. Your privacy is guaranteed.
          </p>
        </div>
      </div>
    </div>
  )
}
