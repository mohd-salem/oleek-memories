'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  Scissors,
  AlertTriangle,
  Shield,
} from 'lucide-react';

// ---------- constants ----------
const MAX_PART_SIZE = 4.5 * 1024 * 1024 * 1024; // 4.5 GB
const CHUNK_SIZE = 50 * 1024 * 1024; // 50 MB per S3 multipart chunk
const MIN_FILE_SIZE = 1 * 1024 * 1024; // 1 MB minimum
const SPLIT_THRESHOLD = 5 * 1024 * 1024 * 1024; // 5 GB — below this, use convert tool

// ---------- types ----------
type SplitStatus = 'idle' | 'analyzing' | 'uploading' | 'splitting' | 'polling' | 'complete' | 'error';

interface PartStatus {
  partNumber: number;
  jobId: string;
  status: 'SUBMITTED' | 'PROGRESSING' | 'COMPLETE' | 'ERROR' | 'CANCELED';
  progress: number;
  downloadUrl?: string;
  filename?: string;
}

interface Segment {
  partNumber: number;
  startTime: number;
  endTime?: number;
}

// ---------- helpers ----------
function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/** Read video duration from a File without uploading it */
function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (!isFinite(video.duration) || video.duration <= 0) {
        reject(new Error('Could not read video duration. The file may be corrupted.'));
      } else {
        resolve(video.duration);
      }
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read video metadata.'));
    };
    video.src = url;
  });
}

/** Calculate equal-time segments so each is ≤ MAX_PART_SIZE */
function buildSegments(fileSizeBytes: number, durationSeconds: number): Segment[] {
  const numParts = Math.ceil(fileSizeBytes / MAX_PART_SIZE);
  const segDuration = durationSeconds / numParts;
  return Array.from({ length: numParts }, (_, i) => ({
    partNumber: i + 1,
    startTime: i * segDuration,
    endTime: i < numParts - 1 ? (i + 1) * segDuration : undefined, // last part → end of video
  }));
}

// ---------- S3 multipart upload ----------
async function multipartUpload(
  file: File,
  onProgress: (pct: number) => void
): Promise<{ fileId: string; key: string }> {
  // 1. Initiate
  const createRes = await fetch('/api/multipart-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', filename: file.name, contentType: file.type || 'video/mp4' }),
  });
  if (!createRes.ok) throw new Error('Failed to initiate upload');
  const { fileId, key, uploadId } = await createRes.json();

  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const parts: { ETag: string; PartNumber: number }[] = [];
  let uploadedChunks = 0;

  try {
    for (let i = 0; i < totalChunks; i++) {
      const partNumber = i + 1;
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      // Get presigned URL for this part
      const urlRes = await fetch('/api/multipart-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'part-url', key, uploadId, partNumber }),
      });
      if (!urlRes.ok) throw new Error(`Failed to get URL for part ${partNumber}`);
      const { signedUrl } = await urlRes.json();

      // Upload chunk to S3
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: chunk,
      });
      if (!uploadRes.ok) throw new Error(`Failed to upload part ${partNumber}`);

      const etag = uploadRes.headers.get('ETag') ?? '';
      parts.push({ PartNumber: partNumber, ETag: etag });

      uploadedChunks++;
      onProgress(Math.round((uploadedChunks / totalChunks) * 100));
    }

    // 2. Complete
    const completeRes = await fetch('/api/multipart-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete', key, uploadId, parts }),
    });
    if (!completeRes.ok) throw new Error('Failed to finalize upload');
  } catch (err) {
    // Abort on error
    await fetch('/api/multipart-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'abort', key, uploadId }),
    }).catch(() => {});
    throw err;
  }

  return { fileId, key };
}

// ---------- component ----------
export default function SplitVideoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SplitStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [parts, setParts] = useState<PartStatus[]>([]);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // ---- file selection ----
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    setFile(null);
    setDuration(null);
    setSegments([]);

    if (selected.size < MIN_FILE_SIZE) {
      setError('File is too small to split.');
      return;
    }

    if (selected.size <= SPLIT_THRESHOLD) {
      setError(
        `This file is ${formatFileSize(selected.size)} — under the 5 GB limit. Use the Convert Video tool instead.`
      );
      return;
    }

    setStatus('analyzing');
    setFile(selected);

    try {
      const dur = await getVideoDuration(selected);
      setDuration(dur);
      setSegments(buildSegments(selected.size, dur));
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read video metadata.');
      setStatus('idle');
      setFile(null);
    }
  }, []);

  // ---- start split ----
  const handleSplit = async () => {
    if (!file || segments.length === 0) return;

    try {
      // Upload
      setStatus('uploading');
      setError(null);
      setUploadProgress(0);
      const { fileId: fid, key } = await multipartUpload(file, setUploadProgress);
      setFileId(fid);

      // Create split jobs
      setStatus('splitting');
      const splitRes = await fetch('/api/split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: fid, inputKey: key, segments, email: email || undefined }),
      });

      if (!splitRes.ok) {
        const err = await splitRes.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || 'Failed to start split jobs');
      }

      const { jobIds } = await splitRes.json() as { jobIds: string[]; totalParts: number };

      const initialParts: PartStatus[] = jobIds.map((jobId, i) => ({
        partNumber: i + 1,
        jobId,
        status: 'SUBMITTED',
        progress: 0,
      }));
      setParts(initialParts);
      setStatus('polling');

      // Start polling
      startPolling(fid, jobIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  // ---- polling ----
  const startPolling = (fid: string, jobIds: string[]) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    // Use functional update inside interval to always reference latest parts
    pollingRef.current = setInterval(async () => {
      const res = await Promise.all(
        jobIds.map(async (jobId, i) => {
          try {
            const r = await fetch(`/api/status?jobId=${jobId}`);
            if (!r.ok) return null;
            const d = await r.json();
            return { index: i, ...d };
          } catch {
            return null;
          }
        })
      );

      setParts((prev) => {
        const updated = prev.map((p) => {
          const data = res.find((r) => r && r.index === p.partNumber - 1);
          if (!data) return p;
          return {
            ...p,
            status: data.status ?? p.status,
            progress: data.progress ?? p.progress,
          };
        });

        const allDone = updated.every(
          (p) => p.status === 'COMPLETE' || p.status === 'ERROR' || p.status === 'CANCELED'
        );

        if (allDone) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          const anyError = updated.some((p) => p.status === 'ERROR' || p.status === 'CANCELED');
          if (anyError) {
            setError('One or more parts failed to convert. Please try again.');
            setStatus('error');
          } else {
            fetch(`/api/split-download?fileId=${fid}`)
              .then((r) => r.json())
              .then(({ parts: dlParts }: { parts: { partNumber: number; filename: string; downloadUrl: string }[] }) => {
                setParts((p2) =>
                  p2.map((p) => {
                    const dl = dlParts.find((d) => d.partNumber === p.partNumber);
                    return dl ? { ...p, downloadUrl: dl.downloadUrl, filename: dl.filename } : p;
                  })
                );
                setStatus('complete');
              })
              .catch(() => setStatus('complete'));
          }
        }

        return updated;
      });
    }, 4000);
  };

  const handleReset = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setFile(null);
    setDuration(null);
    setSegments([]);
    setEmail('');
    setStatus('idle');
    setUploadProgress(0);
    setError(null);
    setFileId(null);
    setParts([]);
  };

  // ---- render ----
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">

        {/* Page header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gold-100 rounded-full p-4">
              <Scissors className="w-10 h-10 text-gold-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal-900 mb-4">
            Split Large Videos
          </h1>
          <p className="text-lg text-charcoal-600">
            Videos over 5 GB? Split them into device-ready parts (up to 4.5 GB each),
            then load all parts onto your OLEEK memory book.
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-charcoal-700">
            <strong className="font-semibold">How It Works:</strong> Your video is uploaded to secure
            cloud storage, split into equal-time parts (each ≤ 4.5 GB), and converted to device format
            in one step. Enter your email to walk away — links are emailed when ready (valid 24 h).
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">

          {/* ── IDLE / ANALYZING ── */}
          {(status === 'idle' || status === 'analyzing') && (
            <>
              {/* Drop zone */}
              <div className="border-2 border-dashed border-charcoal-200 rounded-lg p-12 text-center mb-6">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="split-upload"
                  disabled={status === 'analyzing'}
                />
                <label
                  htmlFor="split-upload"
                  className={`cursor-pointer flex flex-col items-center ${status === 'analyzing' ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {status === 'analyzing' ? (
                    <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                  ) : (
                    <Upload className="w-12 h-12 text-charcoal-400 mb-4" />
                  )}
                  <p className="text-lg font-semibold text-charcoal-700 mb-2">
                    {status === 'analyzing' ? 'Reading video info…' : 'Click to upload your large video'}
                  </p>
                  <p className="text-sm text-charcoal-500">
                    MP4, MOV, AVI, MKV · Must be over 5 GB
                  </p>
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* File info + segment preview */}
              {file && duration !== null && segments.length > 0 && (
                <>
                  <div className="bg-cream-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-charcoal-800 truncate max-w-xs">{file.name}</p>
                        <p className="text-sm text-charcoal-600">
                          {formatFileSize(file.size)} · {formatDuration(duration)}
                        </p>
                      </div>
                      <button onClick={handleReset} className="text-charcoal-500 hover:text-charcoal-700">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Segment preview */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-charcoal-700 mb-3">
                      This video will be split into <strong>{segments.length} parts</strong>:
                    </p>
                    <div className="space-y-2">
                      {segments.map((seg) => {
                        const segStart = seg.startTime;
                        const segEnd = seg.endTime ?? duration;
                        const segDur = segEnd - segStart;
                        const estSize = (file.size / duration) * segDur;
                        return (
                          <div
                            key={seg.partNumber}
                            className="flex items-center justify-between bg-cream-50 rounded-lg px-4 py-2 text-sm"
                          >
                            <span className="font-medium text-charcoal-700">
                              Part {seg.partNumber}
                            </span>
                            <span className="text-charcoal-500">
                              {formatDuration(segStart)} → {formatDuration(segEnd)}
                            </span>
                            <span className="text-charcoal-500">
                              ~{formatFileSize(estSize)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email */}
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
                      💡 Enter your email and you can leave this page. We&apos;ll send download links
                      for all {segments.length} parts when ready.
                    </p>
                  </div>

                  <button
                    onClick={handleSplit}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Scissors className="w-5 h-5" />
                    Split &amp; Convert ({segments.length} parts)
                  </button>
                </>
              )}
            </>
          )}

          {/* ── UPLOADING ── */}
          {status === 'uploading' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-charcoal-800 mb-4">
                Uploading your video…
              </p>
              <div className="w-full bg-charcoal-100 rounded-full h-3 mb-2">
                <div
                  className="bg-gold-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-charcoal-600">{uploadProgress}% uploaded</p>
              <p className="text-xs text-charcoal-500 mt-3">
                Large files may take several minutes to upload. Please keep this tab open.
              </p>
            </div>
          )}

          {/* ── SPLITTING (jobs created, waiting for first poll) ── */}
          {status === 'splitting' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-charcoal-800 mb-2">
                Starting split jobs in the cloud…
              </p>
              <p className="text-sm text-charcoal-600">
                Creating {segments.length} conversion jobs on AWS.
              </p>
            </div>
          )}

          {/* ── POLLING ── */}
          {status === 'polling' && parts.length > 0 && (
            <div className="py-4">
              <p className="text-lg font-semibold text-charcoal-800 mb-6 text-center">
                Converting {parts.length} parts…
              </p>
              <div className="space-y-4">
                {parts.map((p) => (
                  <div key={p.partNumber} className="bg-cream-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-charcoal-700">Part {p.partNumber}</span>
                      <span className="text-xs text-charcoal-500 capitalize">
                        {p.status === 'PROGRESSING'
                          ? `${p.progress}%`
                          : p.status.toLowerCase()}
                      </span>
                    </div>
                    <div className="w-full bg-charcoal-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          p.status === 'ERROR' || p.status === 'CANCELED'
                            ? 'bg-red-500'
                            : 'bg-gold-500'
                        }`}
                        style={{
                          width: `${
                            p.status === 'COMPLETE'
                              ? 100
                              : p.status === 'ERROR' || p.status === 'CANCELED'
                              ? 100
                              : p.progress
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {email && (
                <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-charcoal-700 text-center">
                    ✅ <strong>You can leave this page!</strong> We&apos;ll email all download links
                    to <strong>{email}</strong> when ready.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── COMPLETE ── */}
          {status === 'complete' && parts.length > 0 && (
            <div className="py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-charcoal-900 text-center mb-2">
                All parts ready!
              </h2>
              <p className="text-charcoal-600 text-center mb-8">
                Your video has been split into {parts.length} device-ready parts.
                Download each one and copy them all onto your OLEEK memory book.
              </p>

              <div className="space-y-4 mb-8">
                {parts.map((p) => (
                  <div
                    key={p.partNumber}
                    className="flex items-center justify-between bg-cream-50 rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="font-medium text-charcoal-800">
                        Part {p.partNumber}
                        {p.filename ? ` — ${p.filename}` : ''}
                      </span>
                    </div>
                    {p.downloadUrl ? (
                      <a
                        href={p.downloadUrl}
                        download={p.filename}
                        className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    ) : (
                      <span className="text-sm text-charcoal-500">Preparing…</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-charcoal-700">
                <strong>Next steps:</strong> Copy all {parts.length} MP4 files onto your OLEEK memory
                book device. Parts will play in order (Part 1, Part 2…).
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-charcoal-800 hover:bg-charcoal-900 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Split Another Video
              </button>
            </div>
          )}

          {/* ── ERROR ── */}
          {status === 'error' && (
            <div className="py-8 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-charcoal-900 mb-2">Something went wrong</h2>
              <p className="text-charcoal-600 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* FAQ-style notes */}
        <div className="mt-10 bg-white rounded-xl shadow-sm p-6 text-sm text-charcoal-600 space-y-3">
          <p className="font-semibold text-charcoal-800 text-base">Frequently asked questions</p>
          <p>
            <strong>What happens to the original video?</strong> It is stored securely on AWS S3 and
            automatically deleted within 24 hours.
          </p>
          <p>
            <strong>How are the cut points decided?</strong> The video is divided into equal-time
            segments. For a 90-minute / 10 GB video the tool creates three ~30-minute parts.
          </p>
          <p>
            <strong>Can I play parts out of order?</strong> Each part is a standalone MP4. Load them
            in order (Part 1, Part 2…) onto your device for a seamless viewing experience.
          </p>
          <p>
            <strong>My video is under 5 GB — can I still use this?</strong> No need — use the{' '}
            <a href="/convert" className="text-gold-600 underline underline-offset-2">
              Convert Video
            </a>{' '}
            tool instead, which handles files up to 5 GB.
          </p>
        </div>
      </div>
    </div>
  );
}
