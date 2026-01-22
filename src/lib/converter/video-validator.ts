import type { VideoInfo } from '@/types/conversion'
import { getSupportedMimeTypes, MAX_FILE_SIZE } from '@/lib/constants/supported-formats'

export interface ValidationResult {
  valid: boolean
  error?: string
  warning?: string
}

// Validate video file before conversion
export function validateVideoFile(file: File): ValidationResult {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file selected',
    }
  }

  // Check file type
  const supportedMimeTypes = getSupportedMimeTypes()
  const isVideo = file.type.startsWith('video/') || supportedMimeTypes.includes(file.type)
  
  if (!isVideo) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type || 'unknown'}. Please select a video file.`,
    }
  }

  // Check file size - hard limit
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large (${formatFileSize(file.size)}). Maximum size is 2GB. Please use a smaller file or contact support.`,
    }
  }

  // Warning for large files (over 1GB)
  const warningSize = 1 * 1024 * 1024 * 1024 // 1GB
  if (file.size > warningSize) {
    return {
      valid: true,
      warning: `Large file detected (${formatFileSize(file.size)}). Conversion may take 30-60 minutes. Make sure your device is plugged in.`,
    }
  }

  return {
    valid: true,
  }
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Format duration in seconds to MM:SS or HH:MM:SS
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// Extract video info for display
export function getVideoInfo(file: File): VideoInfo {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  }
}
