// Type definitions for video conversion

export interface ConversionProgress {
  status: 'idle' | 'loading-ffmpeg' | 'converting' | 'completed' | 'error'
  progress: number // 0-100
  currentStep?: string
  error?: string
}

export interface ConversionResult {
  originalSize: number
  convertedSize: number
  duration: number // conversion time in seconds
  blob: Blob
  filename: string
  outputFilename?: string
  downloadUrl?: string // For server-side downloads
}

export interface SupportedFormat {
  extension: string
  mimeTypes: string[]
  displayName: string
}

export interface VideoInfo {
  name: string
  size: number
  type: string
}

export interface ConversionConfig {
  codec: string
  videoBitrate: string
  audioBitrate: string
  fps: number
  maxWidth: number
  maxHeight: number
  aspectRatio: string
}
