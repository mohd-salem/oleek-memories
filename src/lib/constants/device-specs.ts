import type { ConversionConfig } from '@/types/conversion'

// OLEEK Memories Book device specifications
// Output format optimized for device playback
export const DEVICE_SPECS: ConversionConfig = {
  codec: 'libx264',           // H.264 codec (widely compatible)
  videoBitrate: '5M',         // 5 Mbps (balances quality and file size)
  audioBitrate: '128k',       // 128 kbps AAC audio
  fps: 30,                    // 30 frames per second
  maxWidth: 1920,             // Maximum 1080p width
  maxHeight: 1080,            // Maximum 1080p height
  aspectRatio: '16:9',        // Widescreen aspect ratio
}

// FFmpeg command arguments for conversion
export const getFFmpegArgs = (inputFileName: string, outputFileName: string): string[] => {
  return [
    '-i', inputFileName,                                    // Input file
    '-c:v', DEVICE_SPECS.codec,                            // Video codec
    '-b:v', DEVICE_SPECS.videoBitrate,                     // Video bitrate
    '-maxrate', '8M',                                       // Max bitrate (buffer)
    '-bufsize', '16M',                                      // Buffer size
    '-vf', `scale='min(${DEVICE_SPECS.maxWidth},iw)':min'(${DEVICE_SPECS.maxHeight},ih)':force_original_aspect_ratio=decrease,pad=${DEVICE_SPECS.maxWidth}:${DEVICE_SPECS.maxHeight}:(ow-iw)/2:(oh-ih)/2,fps=${DEVICE_SPECS.fps}`, // Scale and pad
    '-c:a', 'aac',                                         // Audio codec
    '-b:a', DEVICE_SPECS.audioBitrate,                     // Audio bitrate
    '-ar', '48000',                                        // Audio sample rate
    '-ac', '2',                                            // Stereo audio
    '-movflags', '+faststart',                             // Web optimization
    '-y',                                                  // Overwrite output
    outputFileName,                                        // Output file
  ]
}

// Device screen resolution
export const DEVICE_RESOLUTION = {
  width: 1024,
  height: 600,
}

// Storage capacity
export const STORAGE_CAPACITY = {
  '16GB': 16 * 1024 * 1024 * 1024, // 16GB in bytes
  '32GB': 32 * 1024 * 1024 * 1024, // 32GB in bytes
}

// Expected video duration per GB (approximate)
export const HOURS_PER_GB = 0.4 // ~2.5GB per hour at 5Mbps
