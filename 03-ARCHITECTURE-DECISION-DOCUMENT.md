# OLEEK Memories Book - Architecture Decision Document (ADD)

**Version:** 1.0  
**Date:** January 21, 2026  
**Status:** Approved for Implementation  
**Decision Makers:** Engineering Team, Product Owner

---

## 1. EXECUTIVE SUMMARY

### 1.1 Decision
We will implement **client-side video conversion using ffmpeg.wasm** as the primary conversion method for the OLEEK Memories Book website, with a manual support fallback for edge cases.

### 1.2 Rationale
- **Privacy-first approach:** No video data leaves user's device
- **Zero server costs:** No need for expensive video processing infrastructure
- **Instant results:** No upload/download time beyond file I/O
- **Competitive differentiation:** Unique selling point vs competitors who upload to servers
- **Scalability:** Handles unlimited concurrent users without server strain

### 1.3 Trade-offs Accepted
- Slower conversion on low-end devices
- Browser compatibility limitations (requires modern browser with WebAssembly)
- No batch processing (one file at a time)
- Memory constraints for very large files (>2GB)

---

## 2. CONTEXT & PROBLEM STATEMENT

### 2.1 Business Requirements
The OLEEK Memories Book requires videos in a specific format to play correctly:
- **Container:** MP4
- **Video Codec:** H.264
- **Resolution:** Max 1080p (device screen is 1024x600)
- **Bitrate:** ~5 Mbps optimal, max 8 Mbps
- **Frame Rate:** 30 fps
- **Aspect Ratio:** 16:9 preferred

Many customers have videos from:
- Wedding videographers (often 4K, high bitrate)
- Smartphones (various formats/codecs)
- GoPros (high framerate, unusual aspect ratios)
- Downloaded from social media (various formats)

**Problem:** 60-70% of raw videos from these sources won't play correctly on the device without conversion.

### 2.2 User Pain Points (Competitor Analysis)
Analyzing The Motion Books' approach revealed:
- Users must upload videos to external servers (privacy concern)
- Temporary storage on Google Drive (data security questions)
- Email delivery of converted files (delays, potential email size limits)
- No transparency about data retention

**Opportunity:** Provide instant, private, transparent conversion to differentiate OLEEK.

---

## 3. ARCHITECTURAL OPTIONS EVALUATED

### Option 1: Client-Side Conversion (ffmpeg.wasm) ✅ SELECTED

**Description:** Use WebAssembly port of FFmpeg running entirely in the user's browser.

**Pros:**
- ✅ Complete privacy – files never leave user's device
- ✅ Zero server infrastructure costs (no video processing servers)
- ✅ Unlimited scalability (each user's device does the work)
- ✅ Instant start (no upload time)
- ✅ Works offline after library loads
- ✅ Competitive differentiation ("privacy-first" marketing message)
- ✅ No data storage/retention compliance issues

**Cons:**
- ❌ Requires modern browser with WebAssembly support
- ❌ Performance varies by user's device (slow on old laptops/tablets)
- ❌ Large initial library download (~30MB for ffmpeg.wasm)
- ❌ Memory constraints (browser memory limits, typically 2GB)
- ❌ Can't process extremely large files (>2GB challenging)
- ❌ No server-side quality control/validation

**Risk Mitigation:**
- Lazy-load library only when needed
- Display clear browser compatibility message
- Provide manual support fallback for edge cases
- Set recommended file size limit (2GB)

---

### Option 2: Server-Side Conversion (Node.js + FFmpeg)

**Description:** Upload videos to our server, process with FFmpeg, return converted file.

**Pros:**
- ✅ Consistent performance (server specs controlled)
- ✅ Can handle any file size
- ✅ Works on any device/browser
- ✅ Batch processing possible
- ✅ Quality validation before returning file

**Cons:**
- ❌ Privacy concerns (users uploading personal wedding videos)
- ❌ High server costs (CPU-intensive, storage, bandwidth)
- ❌ Upload/download time delays (large files = long waits)
- ❌ Scalability issues (need to provision for peak loads)
- ❌ Data retention/compliance requirements (GDPR, etc.)
- ❌ Potential email delivery issues (file size limits)

**Cost Estimate:**
- Server: $200-500/month (video processing VM)
- Storage: $50-100/month (temporary file storage)
- Bandwidth: $0.08-0.12/GB (could be $100s/month at scale)
- Total: ~$400-800/month + scaling costs

---

### Option 3: Hybrid Approach

**Description:** Client-side by default, server-side fallback for failures/large files.

**Pros:**
- ✅ Best of both worlds for user experience
- ✅ Handles edge cases gracefully
- ✅ Still emphasizes privacy-first approach

**Cons:**
- ❌ Complexity (maintain two conversion pipelines)
- ❌ Still requires server infrastructure
- ❌ Confusing user experience (why did some videos go to server?)
- ❌ Additional development/testing time

**Decision:** Defer to V2 if client-side proves insufficient. Start with Option 1 + manual support.

---

### Option 4: Third-Party API (e.g., Cloudinary, Mux)

**Description:** Use video processing SaaS.

**Pros:**
- ✅ No infrastructure management
- ✅ Consistent quality
- ✅ Fast processing (optimized infrastructure)

**Cons:**
- ❌ Per-conversion costs (typically $0.01-0.10/minute of video)
- ❌ At 500 conversions/month avg 15 min/video = $75-750/month
- ❌ Privacy concerns remain (third-party processing)
- ❌ Vendor lock-in
- ❌ Less control over conversion parameters

---

## 4. DECISION: CLIENT-SIDE CONVERSION (OPTION 1)

### 4.1 Implementation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User's Browser                         │
│                                                             │
│  ┌──────────────┐                                          │
│  │ React UI     │                                          │
│  │ (Next.js)    │                                          │
│  └──────┬───────┘                                          │
│         │                                                   │
│         │ 1. User selects video file                       │
│         ▼                                                   │
│  ┌──────────────────────────────┐                         │
│  │ File Validation              │                         │
│  │ - Check format               │                         │
│  │ - Check size (<2GB rec)      │                         │
│  └──────┬───────────────────────┘                         │
│         │                                                   │
│         │ 2. Load FFmpeg library (lazy)                    │
│         ▼                                                   │
│  ┌──────────────────────────────┐                         │
│  │ FFmpeg.wasm Loader           │                         │
│  │ - Fetch from CDN (~30MB)     │                         │
│  │ - Initialize in Web Worker   │                         │
│  └──────┬───────────────────────┘                         │
│         │                                                   │
│         │ 3. Convert video                                 │
│         ▼                                                   │
│  ┌──────────────────────────────┐                         │
│  │ Conversion Engine            │                         │
│  │ - Read file into memory      │                         │
│  │ - Execute FFmpeg command     │                         │
│  │ - Monitor progress           │                         │
│  │ - Generate output MP4        │                         │
│  └──────┬───────────────────────┘                         │
│         │                                                   │
│         │ 4. Download converted file                       │
│         ▼                                                   │
│  ┌──────────────────────────────┐                         │
│  │ Download Manager             │                         │
│  │ - Create blob URL            │                         │
│  │ - Trigger download           │                         │
│  │ - Cleanup memory             │                         │
│  └──────────────────────────────┘                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

         No network requests (except library load)
         No server-side processing
         No data transmission
```

### 4.2 Technology Stack

**Core Library:**
- **@ffmpeg/ffmpeg** (v0.12.x or latest stable)
  - Main FFmpeg.wasm wrapper
- **@ffmpeg/util** (v0.12.x)
  - Utility functions for file handling

**Supporting Technologies:**
- **Web Workers:** Offload conversion to background thread (non-blocking UI)
- **SharedArrayBuffer:** Enable multi-threaded FFmpeg for performance (where supported)
- **File API:** Handle video file reads
- **Blob API:** Generate downloadable output files
- **Next.js:** Framework for React-based UI
- **React:** Component-based UI for conversion wizard

**CDN for FFmpeg Core:**
- Serve from unpkg or jsDelivr (fallback to self-hosted)
- Core files: `ffmpeg-core.js`, `ffmpeg-core.wasm`, `ffmpeg-core.worker.js`

### 4.3 Detailed Conversion Specifications

#### Input Validation
```javascript
const SUPPORTED_FORMATS = [
  'mp4', 'mov', 'm4v',      // Common formats
  'avi', 'wmv', 'mkv',      // Windows/cross-platform
  'webm', 'flv',            // Web/streaming
  'mts', 'mxf'              // Professional cameras
];

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const WARN_FILE_SIZE = 500 * 1024 * 1024;     // 500MB (show warning)
```

#### FFmpeg Command Template

**Full Command:**
```bash
ffmpeg -i input.{ext} \
  -vf "scale=w=1920:h=1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -profile:v high \
  -level 4.1 \
  -b:v 5000k \
  -maxrate 8000k \
  -bufsize 8000k \
  -r 30 \
  -pix_fmt yuv420p \
  -c:a aac \
  -b:a 128k \
  -ar 44100 \
  -ac 2 \
  -movflags +faststart \
  output_converted.mp4
```

**Parameter Breakdown:**

| Parameter | Value | Reason |
|-----------|-------|--------|
| `-vf scale` | `1920:1080:force_original_aspect_ratio=decrease` | Downscale to max 1080p, maintain aspect ratio |
| `pad` | `1920:1080:(ow-iw)/2:(oh-ih)/2:black` | Letterbox to 16:9 with black bars |
| `-c:v` | `libx264` | H.264 codec for universal compatibility |
| `-preset` | `medium` | Balance speed vs compression (medium = ~30% faster than veryslow, similar quality) |
| `-crf` | `23` | Constant Rate Factor (18-23 = visually lossless, 23 good balance) |
| `-profile:v` | `high` | H.264 profile (high = best quality, widely supported) |
| `-level` | `4.1` | H.264 level (4.1 = 1080p30, max 20 Mbps) |
| `-b:v` | `5000k` | Target bitrate 5 Mbps (good quality, saves battery) |
| `-maxrate` | `8000k` | Max bitrate 8 Mbps (prevent spikes) |
| `-bufsize` | `8000k` | Rate control buffer (1 second at maxrate) |
| `-r` | `30` | Force 30 fps (drop frames if higher) |
| `-pix_fmt` | `yuv420p` | Pixel format (most compatible, required for some players) |
| `-c:a` | `aac` | Audio codec (AAC = universal) |
| `-b:a` | `128k` | Audio bitrate (128k = good quality, stereo) |
| `-ar` | `44100` | Audio sample rate (44.1 kHz = standard) |
| `-ac` | `2` | Audio channels (stereo) |
| `-movflags` | `+faststart` | Move metadata to front (faster streaming/playback start) |

#### Expected Output Characteristics

For a typical 10-minute wedding highlight video:

| Attribute | Before (4K source) | After (Converted) |
|-----------|-------------------|-------------------|
| Resolution | 3840x2160 | 1920x1080 |
| Bitrate | 60 Mbps | 5 Mbps |
| Frame Rate | 60 fps | 30 fps |
| File Size | ~4.5 GB | ~375 MB |
| Codec | H.265/HEVC | H.264 |

**Size Reduction:** ~90% for 4K sources, ~30-50% for 1080p high-bitrate sources.

### 4.4 Performance Optimization

#### Lazy Loading Strategy
```javascript
// Do NOT load ffmpeg on page load
// Load only when user selects a file

const loadFFmpeg = async () => {
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
  
  const ffmpeg = new FFmpeg();
  
  // Load core from CDN (with self-hosted fallback)
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
  });
  
  return ffmpeg;
};
```

#### Progress Reporting
```javascript
ffmpeg.on('progress', ({ progress, time }) => {
  // progress: 0 to 1
  // time: current processing time in microseconds
  
  const percentage = Math.round(progress * 100);
  const currentTime = time / 1000000; // Convert to seconds
  const eta = calculateETA(currentTime, progress); // Estimate remaining time
  
  updateUI({
    percentage,
    currentTime,
    eta,
    status: 'converting'
  });
});
```

#### Memory Management
```javascript
const convertVideo = async (file) => {
  const ffmpeg = await loadFFmpeg();
  
  try {
    // Write input file to FFmpeg virtual filesystem
    await ffmpeg.writeFile('input.mp4', await fetchFile(file));
    
    // Execute conversion
    await ffmpeg.exec([/* command args */]);
    
    // Read output file
    const data = await ffmpeg.readFile('output_converted.mp4');
    
    // Clean up virtual filesystem
    await ffmpeg.deleteFile('input.mp4');
    await ffmpeg.deleteFile('output_converted.mp4');
    
    // Return as blob for download
    return new Blob([data.buffer], { type: 'video/mp4' });
    
  } finally {
    // Terminate FFmpeg instance to free memory
    ffmpeg.terminate();
  }
};
```

### 4.5 Browser Compatibility & Fallbacks

#### Minimum Requirements
- **WebAssembly Support:** Required (Chrome 57+, Firefox 52+, Safari 11+, Edge 16+)
- **File API:** Required (all modern browsers)
- **Blob API:** Required (all modern browsers)
- **Web Workers:** Recommended (gracefully degrade to main thread if unavailable)
- **SharedArrayBuffer:** Optional (performance boost, but not critical)

#### Feature Detection
```javascript
const checkCompatibility = () => {
  const hasWebAssembly = typeof WebAssembly === 'object';
  const hasFileAPI = typeof File !== 'undefined' && typeof FileReader !== 'undefined';
  const hasBlobAPI = typeof Blob !== 'undefined';
  const hasWorkers = typeof Worker !== 'undefined';
  
  if (!hasWebAssembly || !hasFileAPI || !hasBlobAPI) {
    return {
      compatible: false,
      message: 'Your browser is not supported. Please use Chrome, Firefox, Safari, or Edge (latest version).'
    };
  }
  
  return { compatible: true };
};
```

#### Browser-Specific Handling

**Safari (iOS/macOS):**
- Issue: SharedArrayBuffer disabled by default (security policy)
- Solution: Use single-threaded mode (slower, but functional)
- Workaround: Detect Safari and load single-thread core

**Firefox:**
- Issue: Memory limits can be lower than Chrome
- Solution: Recommend smaller file sizes for Firefox users
- Detection: Check `navigator.userAgent`

**Mobile Browsers:**
- Issue: Limited memory, slower processing
- Solution: Show warning for files >500MB on mobile
- Detection: Check screen size or user agent

#### Fallback Strategy

**If client-side fails:**
1. Display user-friendly error message
2. Suggest alternatives:
   - Try a smaller file
   - Try a different browser (Chrome recommended)
   - Use desktop instead of mobile
   - Contact support for manual conversion
3. Provide email contact: support@oleek.com
4. **Manual support workflow:**
   - User emails video file (or upload link)
   - Support team converts using desktop FFmpeg
   - Email converted file back (or Google Drive link if >25MB)
   - SLA: 24-48 hours

---

## 5. FALLBACK PLAN (V2 CONSIDERATION)

If client-side conversion proves insufficient (>10% failure rate or excessive support burden), we will implement:

### Option A: Server-Side Fallback (Minimal)
- **Trigger:** Only when client-side fails or user explicitly requests
- **Implementation:** Simple Node.js server with FFmpeg
- **Hosting:** Cheap VPS ($20/month) or serverless (AWS Lambda with EFS)
- **Privacy:** Clear disclosure when server-side is used
- **Cost:** Estimate $50-100/month for 50-100 fallback conversions

### Option B: Hybrid with Email Delivery
- Similar to competitor's approach
- Upload to temporary storage (auto-delete after 24 hours)
- Process server-side
- Email download link
- Last resort if manual support becomes overwhelming

### Option C: Desktop App
- Electron-based desktop converter app
- Download and run locally
- Still private (no upload), but more reliable than browser
- Useful for very large files or power users

---

## 6. EXACT MP4 OUTPUT SPECIFICATIONS

### 6.1 Container & Codec
```
Container: MP4 (MPEG-4 Part 14)
Video Codec: H.264/AVC (libx264)
Audio Codec: AAC-LC
```

### 6.2 Video Parameters
```
Resolution: Max 1920x1080 (16:9 aspect ratio)
  - If source is >1080p: Downscale to 1080p
  - If source is <1080p: Keep original (do not upscale)
  - If source is non-16:9: Letterbox with black padding

Bitrate: 
  - Target: 5 Mbps (5000 kbps)
  - Maximum: 8 Mbps (8000 kbps)
  - Mode: Variable Bitrate (VBR) with CRF 23

Frame Rate:
  - Target: 30 fps
  - If source is >30fps: Drop to 30fps
  - If source is <30fps: Keep original (e.g., 24fps is fine)

Pixel Format: yuv420p (8-bit, 4:2:0 chroma subsampling)

H.264 Profile: High
H.264 Level: 4.1 (supports 1080p30, max 20 Mbps)

Encoding Preset: medium (balance speed vs compression)

GOP (Group of Pictures): Auto (typically keyframe every 2-5 seconds)

B-frames: Enabled (H.264 High profile feature for compression)
```

### 6.3 Audio Parameters
```
Codec: AAC-LC (Low Complexity)
Bitrate: 128 kbps
Sample Rate: 44100 Hz (44.1 kHz)
Channels: 2 (Stereo)
  - If source is mono: Convert to stereo (duplicate channel)
  - If source is 5.1/7.1: Downmix to stereo
```

### 6.4 Metadata & Container Options
```
MP4 FastStart: Enabled (-movflags +faststart)
  - Moves moov atom to beginning of file
  - Allows playback to start before full download
  - Critical for device that reads sequentially

Metadata: Preserve original metadata where possible
  - Title, Date, Copyright (if present)
  - Strip GPS/location data for privacy

Duration: Maintain original (no trimming unless explicitly requested)
```

### 6.5 File Size Estimates

For a 10-minute video at 5 Mbps:
```
Video: 5 Mbps × 600 seconds = 3000 Mb = 375 MB
Audio: 128 Kbps × 600 seconds = 76.8 Mb = 9.6 MB
Total: ~385 MB (allowing for container overhead)
```

Storage capacity on device:
```
16GB model (usable ~14.5GB):
  - 10-min videos at 5 Mbps: ~37 videos
  - Total duration: ~6 hours

32GB model (usable ~29GB):
  - 10-min videos at 5 Mbps: ~75 videos
  - Total duration: ~12.5 hours
```

### 6.6 Quality vs File Size Trade-offs

| CRF Value | Quality | File Size | Use Case |
|-----------|---------|-----------|----------|
| 18 | Visually lossless | ~1.5x larger | Maximum quality |
| 23 | High quality | Baseline | **Recommended (default)** |
| 28 | Good quality | ~0.6x smaller | Space-constrained |

**Decision:** Use CRF 23 as default. Provides excellent quality while optimizing battery and storage.

---

## 7. TESTING STRATEGY

### 7.1 Test Video Library
Create test suite with various video sources:

**Resolution Tests:**
- 4K (3840x2160) @ 60fps, 60 Mbps
- 1080p (1920x1080) @ 30fps, 10 Mbps
- 720p (1280x720) @ 30fps, 5 Mbps
- 480p (854x480) @ 24fps, 2 Mbps

**Aspect Ratio Tests:**
- 16:9 (standard)
- 21:9 (ultrawide)
- 9:16 (vertical/portrait)
- 4:3 (old format)

**Format/Codec Tests:**
- MP4 (H.264) - should pass through quickly
- MP4 (H.265/HEVC) - needs transcode
- MOV (ProRes) - large file, needs transcode
- AVI (various codecs)
- MKV (various codecs)
- WebM (VP9)

**Edge Cases:**
- Very short video (5 seconds)
- Very long video (2+ hours)
- Large file size (>2GB)
- Corrupted video file
- Audio-only file (MP3)
- No audio track

### 7.2 Validation Checklist
For each converted video:
- [ ] Plays correctly on OLEEK device (no "No Files Found" error)
- [ ] Video resolution is 1080p or lower
- [ ] Bitrate is within 5-8 Mbps range
- [ ] Frame rate is 30 fps or lower
- [ ] Audio is in sync (no drift >100ms)
- [ ] No visual artifacts (blockiness, banding)
- [ ] Aspect ratio is correct (no stretching)
- [ ] File size is reasonable (not bloated)
- [ ] FastStart enabled (playback starts immediately on device)

### 7.3 Performance Benchmarks
Run conversion tests on:
- High-end desktop (16GB RAM, modern CPU)
- Mid-range laptop (8GB RAM, i5/Ryzen 5)
- Low-end laptop (4GB RAM, older CPU)
- iPad Pro
- iPhone (latest model)
- Android tablet

Target: 10-minute 1080p video converts in <10 minutes on mid-range laptop.

---

## 8. MONITORING & SUCCESS METRICS

### 8.1 Technical Metrics
- **Conversion Success Rate:** Target 95%+
- **Average Conversion Time:** <1x realtime for 1080p sources
- **Browser Compatibility Rate:** 98%+ of visitors can use tool
- **Error Rate by Type:** Track most common errors
- **Memory Usage:** Max 1GB for files <500MB

### 8.2 User Experience Metrics
- **Tool Usage Rate:** 30%+ of website visitors try converter
- **Completion Rate:** 80%+ of started conversions complete successfully
- **Retry Rate:** <10% of users retry after first conversion
- **Support Tickets:** <5% of conversions result in support contact

### 8.3 Business Metrics
- **Cost Savings:** $0 infrastructure cost vs $400-800/month for server-side
- **Marketing Value:** "Privacy-first" messaging in ads/content
- **Customer Satisfaction:** Positive mentions of converter in reviews
- **Amazon Conversion Lift:** Track if converter users have higher purchase rate

---

## 9. RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Browser incompatibility | High | Low | Feature detection, clear messaging, manual fallback |
| Large file crashes browser | Medium | Medium | File size warnings, recommend desktop for >2GB, manual fallback |
| Slow conversion frustrates users | Medium | Medium | Set expectations (time estimate), progress bar, allow background tab |
| User closes tab mid-conversion | Low | Medium | Save progress not possible, just allow re-start |
| FFmpeg.wasm library breaks | High | Low | Pin specific version, host copy on our CDN as backup |
| Memory leaks on multiple conversions | Medium | Low | Terminate FFmpeg instance after each conversion, test extensively |
| Output video doesn't play on device | High | Low | Extensive testing with actual device, strict adherence to specs |

---

## 10. DECISION APPROVAL

**Approved By:**
- [X] Engineering Lead
- [X] Product Owner
- [X] UX Designer
- [ ] Legal/Privacy (if applicable)

**Date:** January 21, 2026

**Next Steps:**
1. Implement converter UI in Next.js
2. Integrate ffmpeg.wasm library
3. Test with 50+ sample videos
4. Validate output on actual OLEEK device
5. Deploy to staging for beta testing
6. Monitor success metrics for 2 weeks
7. Launch to production

---

**END OF ARCHITECTURE DECISION DOCUMENT**
