const ALLOWED_MIME_TYPES = [
  'video/mp4',
  'video/quicktime', // MOV
  'video/x-msvideo', // AVI
  'video/x-matroska', // MKV
  'video/webm',
  'video/mpeg',
  'video/x-m4v',
];

const ALLOWED_EXTENSIONS = [
  '.mp4',
  '.mov',
  '.avi',
  '.mkv',
  '.webm',
  '.mpeg',
  '.mpg',
  '.m4v',
];

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type);
  const hasValidExt = ALLOWED_EXTENSIONS.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );

  if (!hasValidMime && !hasValidExt) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a video file (MP4, MOV, AVI, MKV, etc.)',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024 * 1024)}GB`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }

  return { valid: true };
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 200);
}
