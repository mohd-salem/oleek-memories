'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileVideo } from 'lucide-react'
import { validateVideoFile } from '@/lib/converter/video-validator'
import { getSupportedFormatsDisplay } from '@/lib/constants/supported-formats'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export default function FileUploader({ onFileSelect, disabled = false }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const validation = validateVideoFile(file)
      
      if (validation.valid) {
        onFileSelect(file)
      } else {
        alert(validation.error || 'Invalid file')
      }
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': [] // Accept all video types
    },
    maxFiles: 1,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center transition-all
        ${isDragActive ? 'border-gold-500 bg-gold-50' : 'border-cream-200 bg-cream-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gold-400 hover:bg-cream-50'}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center">
        {isDragActive ? (
          <>
            <FileVideo className="h-16 w-16 text-gold-500 mb-4" />
            <p className="text-lg font-semibold text-gold-600">
              Drop your video here
            </p>
          </>
        ) : (
          <>
            <Upload className="h-16 w-16 text-slate-400 mb-4" />
            <p className="text-lg font-semibold text-charcoal-900 mb-2">
              Drag & drop your video here
            </p>
            <p className="text-charcoal-700 mb-4">
              or click to browse files
            </p>
            <p className="text-sm text-slate-600">
              Supports: {getSupportedFormatsDisplay()}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Best results with files under 2GB
            </p>
          </>
        )}
      </div>
    </div>
  )
}
