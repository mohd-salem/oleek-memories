import type { SupportedFormat } from '@/types/conversion'

// Supported input video formats
export const SUPPORTED_FORMATS: SupportedFormat[] = [
  {
    extension: 'mp4',
    mimeTypes: ['video/mp4'],
    displayName: 'MP4',
  },
  {
    extension: 'mov',
    mimeTypes: ['video/quicktime'],
    displayName: 'MOV (QuickTime)',
  },
  {
    extension: 'avi',
    mimeTypes: ['video/x-msvideo'],
    displayName: 'AVI',
  },
  {
    extension: 'mkv',
    mimeTypes: ['video/x-matroska'],
    displayName: 'MKV',
  },
  {
    extension: 'wmv',
    mimeTypes: ['video/x-ms-wmv'],
    displayName: 'WMV',
  },
  {
    extension: 'm4v',
    mimeTypes: ['video/x-m4v'],
    displayName: 'M4V',
  },
  {
    extension: 'flv',
    mimeTypes: ['video/x-flv'],
    displayName: 'FLV',
  },
  {
    extension: 'webm',
    mimeTypes: ['video/webm'],
    displayName: 'WebM',
  },
]

// Get all supported MIME types for file validation
export const getSupportedMimeTypes = (): string[] => {
  return SUPPORTED_FORMATS.flatMap(format => format.mimeTypes)
}

// Get display string for supported formats
export const getSupportedFormatsDisplay = (): string => {
  return SUPPORTED_FORMATS.map(f => f.extension.toUpperCase()).join(', ')
}

// Maximum recommended file size (2GB)
export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024 // 2GB in bytes

// Maximum file size for warning (1GB)
export const WARNING_FILE_SIZE = 1 * 1024 * 1024 * 1024 // 1GB in bytes
