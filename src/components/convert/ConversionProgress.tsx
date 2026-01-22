'use client'

import { Loader2 } from 'lucide-react'
import type { ConversionProgress as ConversionProgressType } from '@/types/conversion'

interface ConversionProgressProps {
  progress: ConversionProgressType
  onCancel?: () => void
}

export default function ConversionProgress({ progress, onCancel }: ConversionProgressProps) {
  const { status, progress: percent, currentStep } = progress

  // Determine display message
  let displayMessage = currentStep || 'Processing...'
  if (status === 'loading-ffmpeg') {
    displayMessage = 'Loading conversion library (one-time download)...'
  }

  return (
    <div className="bg-cream-100 rounded-lg p-8">
      <div className="flex flex-col items-center">
        {/* Animated spinner */}
        <Loader2 className="h-12 w-12 text-gold-500 animate-spin mb-6" />
        
        {/* Status message */}
        <p className="text-lg font-semibold text-charcoal-900 mb-2">
          {displayMessage}
        </p>
        
        {/* Progress bar */}
        <div className="w-full max-w-md bg-cream-200 rounded-full h-4 mb-3 overflow-hidden">
          <div
            className="bg-gold-500 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>
        
        {/* Progress percentage */}
        <p className="text-sm text-slate-600 mb-6">
          {Math.round(percent)}% complete
        </p>
        
        {/* Help text */}
        <div className="text-center max-w-md">
          <p className="text-sm text-charcoal-700 mb-4">
            This may take several minutes depending on your video size and computer speed. Please keep this tab open.
          </p>
          
          {status === 'loading-ffmpeg' && (
            <p className="text-xs text-slate-600">
              The conversion library (~30MB) is downloading. This happens once and will be cached for future use.
            </p>
          )}
        </div>
        
        {/* Cancel button - optional for future implementation */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-6 text-sm text-slate-600 hover:text-charcoal-900 underline"
          >
            Cancel Conversion
          </button>
        )}
      </div>
    </div>
  )
}
