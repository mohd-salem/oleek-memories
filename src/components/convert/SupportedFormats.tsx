import { getSupportedFormatsDisplay } from '@/lib/constants/supported-formats'

export default function SupportedFormats() {
  return (
    <div className="bg-cream-100 border border-cream-200 rounded-lg p-6">
      <h3 className="font-semibold text-charcoal-900 mb-3">
        Supported Formats
      </h3>
      <p className="text-charcoal-700 text-sm mb-3">
        We support all common video formats:
      </p>
      <p className="text-gold-600 font-medium">
        {getSupportedFormatsDisplay()}
      </p>
      <p className="text-xs text-slate-600 mt-3">
        If your format isn't listed, try converting anyway—we support most video codecs.
      </p>
    </div>
  )
}
