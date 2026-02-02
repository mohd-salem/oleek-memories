'use client';

import { useState, useCallback } from 'react';
import { Upload, CheckCircle2, XCircle, Loader2, Download, Shield } from 'lucide-react';
import { validateVideoFile } from '@/lib/validation/file-validator';

type ConversionStatus = 'idle' | 'uploading' | 'converting' | 'complete' | 'error';

export default function ConvertPageAWS() {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
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

  const startConversion = async (fileId: string, inputKey: string, email?: string) => {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, inputKey, email: email || undefined }),
    });

    if (!response.ok) {
      throw new Error('Failed to start conversion');
    }

    return response.json();
  };

  const pollStatus = async (fileId: string, jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/status?fileId=${fileId}&jobId=${jobId}`);
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
      const { jobId } = await startConversion(fileId, key, email || undefined);
      setJobId(jobId);

      // Poll for status
      pollStatus(fileId, jobId);
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
    setJobId(null);
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

        {/* How It Works Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-charcoal-700">
            <strong className="font-semibold">How It Works:</strong> You upload your video (required wait), then conversion happens in our AWS cloud servers. Enter your email and you can leave this page — we'll send you the download link when ready (~30 sec). Links valid for 24 hours.
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
                <>
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

                  {/* Email Input (Optional) */}
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                    <p className="text-xs text-charcoal-500 mt-1">
                      💡 <strong>Tip:</strong> Enter your email and you can leave this page. We'll email you the download link when ready (usually ~30 seconds)
                    </p>
                  </div>

                  <button
                    onClick={handleConvert}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Start Conversion
                  </button>
                </>
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
                Please wait while we upload your file to secure cloud storage
              </p>
            </div>
          )}

          {status === 'converting' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-charcoal-800 mb-2">
                Converting your video in the cloud...
              </p>
              <div className="w-full bg-charcoal-100 rounded-full h-2 mb-2">
                <div
                  className="bg-gold-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-charcoal-600 mb-3">{progress}% complete</p>
              
              {email ? (
                <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-charcoal-700">
                    ✅ <strong>You can leave this page!</strong><br/>
                    We'll email the download link to <strong>{email}</strong> when ready.<br/>
                    <span className="text-xs text-charcoal-600">Link valid for 24 hours</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-charcoal-500 mt-3">
                  Stay on this page to download immediately, or refresh later to check status
                </p>
              )}
            </div>
          )}

          {status === 'complete' && downloadUrl && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-charcoal-900 mb-2">
                Conversion Complete! 🎉
              </p>
              <p className="text-charcoal-600 mb-6">
                Your video is ready for OLEEK memory books
              </p>
              
              {email && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-charcoal-700">
                    📧 A download link has also been sent to <strong>{email}</strong><br/>
                    <span className="text-xs text-charcoal-600">Check your inbox (and spam folder)</span>
                  </p>
                </div>
              )}
              
              <div className="flex gap-4 justify-center">
                <a
                  href={downloadUrl}
                  download="converted-video.mp4"
                  className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Now
                </a>
                <button
                  onClick={handleReset}
                  className="bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Convert Another
                </button>
              </div>
              <p className="text-xs text-charcoal-500 mt-4">
                💡 Download link valid for 24 hours (both here and in email)
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
