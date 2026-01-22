'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { DEVICE_SPECS } from '@/lib/constants/device-specs'

export default function TechnicalSpecs() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-100 transition-colors"
      >
        <span className="font-semibold text-slate-900">
          What settings do we use?
        </span>
        <ChevronDown 
          className={`h-5 w-5 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 text-sm">
          <p className="text-slate-700 mb-3">
            We automatically optimize your video with these settings for perfect playback on your OLEEK device:
          </p>
          
          <ul className="space-y-2 text-slate-700">
            <li>
              <strong>Format:</strong> MP4 (H.264 codec)
            </li>
            <li>
              <strong>Resolution:</strong> Up to 1080p (downscaled if higher)
            </li>
            <li>
              <strong>Frame Rate:</strong> {DEVICE_SPECS.fps} fps
            </li>
            <li>
              <strong>Video Bitrate:</strong> ~{DEVICE_SPECS.videoBitrate} (max 8 Mbps)
            </li>
            <li>
              <strong>Aspect Ratio:</strong> {DEVICE_SPECS.aspectRatio} (letterboxed if needed)
            </li>
            <li>
              <strong>Audio:</strong> AAC, {DEVICE_SPECS.audioBitrate}
            </li>
          </ul>
          
          <p className="text-xs text-slate-600 mt-3">
            These settings balance excellent quality with optimal file size and battery performance.
          </p>
        </div>
      )}
    </div>
  )
}
