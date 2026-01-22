'use client';

import { useState, useCallback } from 'react';
import { Upload, CheckCircle2, XCircle, Loader2, Download, Shield } from 'lucide-react';
import { validateVideoFile } from '@/lib/validation/file-validator';

type ConversionStatus = 'idle' | 'uploading' | 'converting' | 'complete' | 'error';

export default function ConvertPageAWS() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validation = validateVideoFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setStatus('idle');
    setProgress(0);
    setDownloadUrl(null);
  }, []);

  const uploadToS3 = async (file: File): Promise<{ fileId: string; key: string }> => {
    // Get presigned URL
    const urlResponse = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    if (!urlResponse.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { fileId, uploadUrl, key } = await urlResponse.json();

    // Upload directly to S3
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to S3');
    }

    return { fileId, key };
  };

  const startConversion = async (fileId: string, inputKey: string) => {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, inputKey }),
    });

    if (!response.ok) {
      throw new Error('Failed to start conversion');
    }

    return response.json();
  };

  const pollStatus = async (fileId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/status?fileId=${fileId}`);
        if (!response.ok) {
          clearInterval(interval);
          setStatus('error');
          setError('Failed to check conversion status');
          return;
        }

        const data = await response.json();
        setProgress(data.progress || 0);

        if (data.status === 'COMPLETE') {
          clearInterval(interval);
          setStatus('complete');
          setProgress(100);
          
          // Get download URL
          const downloadResponse = await fetch(`/api/download?fileId=${fileId}`);
          if (downloadResponse.ok) {
            const { downloadUrl } = await downloadResponse.json();
            setDownloadUrl(downloadUrl);
          }
        } else if (data.status === 'ERROR' || data.status === 'CANCELED') {
          clearInterval(interval);
          setStatus('error');
          setError(data.error || 'Conversion failed');
        }
      } catch (err) {
        console.error('Polling error:', err);
        clearInterval(interval);
        setStatus('error');
        setError('Failed to check conversion status');
      }
    }, 3000); // Poll every 3 seconds
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setStatus('uploading');
      setError(null);
      setProgress(0);

      // Upload to S3
      const { fileId, key } = await uploadToS3(file);
      setFileId(fileId);

      setStatus('converting');
      
      // Start conversion
      await startConversion(fileId, key);

      // Poll for status
      pollStatus(fileId);
    } catch (err) {
      console.error('Conversion error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Conversion failed');
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
    setFileId(null);
    setDownloadUrl(null);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal-900 mb-4">
            Convert Your Videos
          </h1>
          <p className="text-lg text-charcoal-600">
            Fast, professional video conversion for OLEEK memory books
          </p>
        </div>

        {/* Security Banner */}
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Shield className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-charcoal-700">
            <strong className="font-semibold">Secure & Private:</strong> Your videos are processed
            securely using AWS cloud infrastructure and automatically deleted after 24 hours. No account required.
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === 'idle' && (
            <>
              <div className="border-2 border-dashed border-charcoal-200 rounded-lg p-12 text-center mb-6">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-charcoal-400 mb-4" />
                  <p className="text-lg font-semibold text-charcoal-700 mb-2">
                    Click to upload your video
                  </p>
                  <p className="text-sm text-charcoal-500">
                    MP4, MOV, AVI, MKV up to 2GB
                  </p>
                </label>
              </div>

              {file && (
                <div className="bg-cream-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-charcoal-800">{file.name}</p>
                      <p className="text-sm text-charcoal-600">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-charcoal-500 hover:text-charcoal-700"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {file && (
                <button
                  onClick={handleConvert}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Start Conversion
                </button>
              )}
            </>
          )}

          {status === 'uploading' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-charcoal-800 mb-2">
                Uploading your video...
              </p>
              <p className="text-sm text-charcoal-600">
                Preparing for conversion
              </p>
            </div>
          )}

          {status === 'converting' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-charcoal-800 mb-2">
                Converting your video...
              </p>
              <div className="w-full bg-charcoal-100 rounded-full h-2 mb-2">
                <div
                  className="bg-gold-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-charcoal-600">{progress}% complete</p>
            </div>
          )}

          {status === 'complete' && downloadUrl && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-charcoal-900 mb-4">
                Conversion Complete!
              </p>
              <p className="text-charcoal-600 mb-6">
                Your video is ready for OLEEK memory books
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href={downloadUrl}
                  download="converted-video.mp4"
                  className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Video
                </a>
                <button
                  onClick={handleReset}
                  className="bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Convert Another
                </button>
              </div>
              <p className="text-xs text-charcoal-500 mt-4">
                Download link expires in 1 hour
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-charcoal-900 mb-2">
                Conversion Failed
              </p>
              <p className="text-charcoal-600 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Output Specs */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h3 className="font-semibold text-charcoal-800 mb-3">Output Specifications</h3>
          <ul className="text-sm text-charcoal-600 space-y-1">
            <li>• Container: MP4</li>
            <li>• Video: H.264, 1920x1080, 30 fps, ~5 Mbps</li>
            <li>• Audio: AAC, 192 kbps</li>
            <li>• Aspect ratio: 16:9 (letterboxed if needed)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
