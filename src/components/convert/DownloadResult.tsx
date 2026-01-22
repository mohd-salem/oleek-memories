'use client'

import { Download, CheckCircle, RefreshCw } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import Button from '@/components/ui/Button'
import type { ConversionResult } from '@/types/conversion'
import { formatFileSize, formatDuration } from '@/lib/converter/video-validator'
import { trackDownload } from '@/lib/utils/analytics'

interface DownloadResultProps {
  result: ConversionResult
  onConvertAnother: () => void
}

export default function DownloadResult({ result, onConvertAnother }: DownloadResultProps) {
  const { originalSize, convertedSize, duration, blob, filename } = result

  // Calculate size reduction
  const sizeReduction = Math.round(((originalSize - convertedSize) / originalSize) * 100)
  const sizeIncreased = convertedSize > originalSize

  // Download file
  const handleDownload = () => {
    // If we have a download URL (server-side), use it
    if (result.downloadUrl) {
      window.location.href = result.downloadUrl
      trackDownload(result.convertedSize)
    } else {
      // Fallback to Blob (client-side)
      const url = URL.createObjectURL(result.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      trackDownload(result.blob.size)
    }
  }

  // Auto-download on mount (better UX)
  // useEffect(() => {
  //   handleDownload()
  // }, [])

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8">
      <div className="flex flex-col items-center text-center">
        {/* Success icon */}
        <div className="bg-green-500 rounded-full p-4 mb-6">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        
        {/* Success message */}
        <h2 className="text-2xl font-display font-bold text-charcoal-900 mb-3">
          Conversion Complete!
        </h2>
        
        <p className="text-charcoal-700 mb-6 max-w-md">
          Your video has been successfully converted and optimized for your OLEEK Memories Book.
        </p>
        
        {/* File stats */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-6 bg-white rounded-lg p-4">
          <div className="text-center">
            <p className="text-xs text-slate-600 mb-1">Original</p>
            <p className="font-semibold text-charcoal-900">{formatFileSize(originalSize)}</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-slate-600 mb-1">Converted</p>
            <p className="font-semibold text-charcoal-900">{formatFileSize(convertedSize)}</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-slate-600 mb-1">Time</p>
            <p className="font-semibold text-charcoal-900">{formatDuration(duration)}</p>
          </div>
        </div>
        
        {/* Size change indicator */}
        {!sizeIncreased && sizeReduction > 10 && (
          <p className="text-sm text-green-700 mb-6">
            File size reduced by {sizeReduction}% while maintaining quality
          </p>
        )}
        
        {/* Download button */}
        <Button
          onClick={handleDownload}
          variant="primary"
          size="lg"
          className="w-full max-w-md mb-4"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Converted Video
        </Button>
        
        <p className="text-sm text-charcoal-700 mb-6">
          File: <span className="font-mono text-xs">{filename}</span>
        </p>
        
        {/* Next steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mb-6">
          <p className="text-sm text-blue-900 font-semibold mb-2">
            Next Steps:
          </p>
          <ol className="text-sm text-blue-900 text-left list-decimal pl-5 space-y-1">
            <li>Connect your OLEEK device to your computer via USB</li>
            <li>Copy the downloaded file to the device</li>
            <li>Safely eject and enjoy your memories!</li>
          </ol>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <Button
            onClick={onConvertAnother}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Convert Another Video
          </Button>
          
          <ButtonLink
            href="/learn"
            variant="ghost"
            size="md"
            className="flex-1"
          >
            How to Load Videos →
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
