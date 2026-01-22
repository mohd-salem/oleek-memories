# OLEEK Video Conversion Service - Architecture & Design

**Version:** 1.0  
**Date:** January 21, 2026  
**Architect:** Senior Frontend & Systems Team  
**Status:** Design Approved for Implementation

---

## 1. ARCHITECTURE DECISION: CLIENT-SIDE CONVERSION (PRIMARY)

### Decision: Use ffmpeg.wasm for Browser-Based Conversion

**Implementation:**
- **Technology:** FFmpeg compiled to WebAssembly (ffmpeg.wasm library)
- **Execution:** 100% client-side (user's browser)
- **Processing:** Web Worker for non-blocking UI
- **Delivery:** Immediate download via Blob API

---

### WHY Client-Side? (Strategic Rationale)

#### 1. **Privacy is Our #1 Differentiator** ⭐⭐⭐⭐⭐

**Problem with Competitors:**
- The Motion Books uploads videos to their servers + Google Drive
- Users hesitate to upload intimate wedding videos to third parties
- Privacy concerns are a barrier to conversion tool usage

**OLEEK Advantage:**
- **Zero upload required** - files never leave the user's device
- Processing happens in browser memory (RAM)
- No server storage, no third-party cloud services
- Competitive marketing message: *"Your intimate memories never leave your device"*

**Impact:**
- **Trust:** Privacy-conscious couples choose OLEEK
- **Compliance:** No GDPR/data protection concerns (no data collected)
- **Marketing:** Strong differentiator in all messaging

---

#### 2. **Zero Infrastructure Costs** 💰

**Cost Comparison:**

| Approach | Monthly Cost (500 conversions) | Scaling Cost |
|----------|-------------------------------|--------------|
| Server-side (VPS) | $200-500 (compute + storage) | High (linear) |
| Serverless (Lambda) | $50-150 (per-minute billing) | Medium |
| Client-side (ffmpeg.wasm) | **$0** | **Zero** |

**Financial Benefits:**
- No video processing servers needed
- No storage costs for uploaded/converted files
- No bandwidth costs (except library download, ~30MB one-time)
- Unlimited concurrent users (each user's device does the work)

**Startup Viability:**
- Critical for early-stage business (preserve cash)
- Can serve 10 users or 10,000 users with same infrastructure
- Budget can focus on marketing and product, not servers

---

#### 3. **Instant Results (No Upload/Download Wait)** ⚡

**User Experience:**

| Step | Server-Side Time | Client-Side Time |
|------|-----------------|------------------|
| Upload 500MB video | 5-15 minutes (varies by connection) | 0 seconds |
| Queue wait | 0-30 minutes (if busy) | 0 seconds |
| Processing | 10-30 minutes | 10-30 minutes |
| Download converted | 3-10 minutes | 0 seconds |
| **Total** | **18-85 minutes** | **10-30 minutes** |

**Client-Side Advantages:**
- No upload bottleneck (often slower than download)
- No queue/waiting for server availability
- Instant download (file already in memory)
- User can start conversion immediately

---

#### 4. **Unlimited Scalability** 📈

**Server-Side Scaling Challenges:**
- Must provision for peak load (wedding season spikes)
- Expensive to over-provision, risky to under-provision
- Need load balancers, auto-scaling, monitoring
- Video processing is CPU-intensive (expensive compute)

**Client-Side Scaling:**
- Each user's device is an independent processing node
- 1 user or 1 million users = same infrastructure (just serving static files)
- No scaling concerns, no traffic spikes to manage
- Natural load distribution

---

#### 5. **Data Security (Defense in Depth)** 🔒

**Threat Model:**

| Threat | Server-Side Risk | Client-Side Risk |
|--------|-----------------|------------------|
| Data breach (hack) | HIGH (all user videos exposed) | ZERO (no data stored) |
| Employee access | MEDIUM (admins can view videos) | ZERO (no access possible) |
| Third-party leaks | HIGH (cloud provider breach) | ZERO (no third party) |
| Man-in-middle | MEDIUM (if HTTPS fails) | LOW (still in browser) |

**Security Posture:**
- **No data to steal** = strongest security
- No database to hack, no S3 bucket to misconfigure
- Compliance is trivial (no data = no compliance burden)
- User trust is maximized

---

#### 6. **Offline Capability (Future Bonus)** 🌐

**Progressive Enhancement:**
- Once ffmpeg.wasm is loaded, it's cached
- Users could convert offline (no internet needed after first load)
- Useful for users with unreliable connections
- Could enable PWA (Progressive Web App) in future

---

### Trade-Offs Accepted (Client-Side Limitations)

#### Cons We Accept:

**1. Browser Compatibility Requirements**
- Requires modern browser with WebAssembly support
- Chrome 57+, Firefox 52+, Safari 11+, Edge 16+
- **Mitigation:** 98%+ of users have compatible browsers (2026)
- **Fallback:** Clear message for outdated browsers

**2. Performance Varies by User Device**
- Low-end laptop: Slower conversion (30-60 min for 1-hour video)
- High-end desktop: Faster conversion (10-20 min for 1-hour video)
- **Mitigation:** Set expectations with time estimate
- **Fallback:** Offer manual support for very slow devices

**3. Large File Challenges**
- Browser memory limits (~2-4GB depending on browser)
- Files >2GB may fail or crash browser tab
- **Mitigation:** Warn users, recommend smaller files
- **Fallback:** Manual support for huge files (rare edge case)

**4. Library Size**
- ffmpeg.wasm core is ~30MB (one-time download)
- **Mitigation:** Lazy load only when user selects file
- **Impact:** Minimal (Netflix streams GB of data, 30MB is acceptable)

**5. No Server-Side Quality Control**
- Can't validate output before user receives it
- **Mitigation:** Extensive testing, high success rate target (95%+)
- **Fallback:** User can contact support if issues

---

### Decision Summary

✅ **Client-side conversion is the RIGHT choice for OLEEK because:**
1. Privacy is our core differentiator vs competitors
2. Zero infrastructure cost = business viability
3. Better user experience (no upload wait)
4. Unlimited scalability with no effort
5. Strongest security posture (no data to protect)

✅ **Trade-offs are acceptable because:**
1. Browser compatibility is excellent in 2026
2. Most users have adequate devices (smartphone CPU power is high)
3. Large files are rare (most wedding highlights are <2GB)
4. One-time 30MB download is reasonable for a specialized tool

✅ **This aligns with business strategy:**
- Premium brand positioning
- Privacy-first messaging
- Startup cash preservation
- Competitive differentiation

---

## 2. FALLBACK PLAN

### When Client-Side Conversion May Fail

**Failure Scenarios:**

1. **Outdated Browser**
   - Browser doesn't support WebAssembly
   - User refuses to update browser
   - **Frequency:** <2% of visitors

2. **File Too Large**
   - Video >2GB causes browser memory exhaustion
   - Browser tab crashes or freezes
   - **Frequency:** ~5% of conversion attempts

3. **Unsupported Codec**
   - Extremely rare codec that ffmpeg.wasm can't decode
   - Proprietary or encrypted format
   - **Frequency:** <1% of attempts

4. **Low-End Device**
   - Device runs out of memory (old tablet, phone)
   - Conversion takes excessively long (>2 hours)
   - User frustration
   - **Frequency:** ~3% of attempts

5. **User Error**
   - User uploads non-video file
   - Corrupted file
   - **Frequency:** ~2% of attempts

**Total Expected Failure Rate:** ~10-15% (conservative estimate)  
**Target Actual Failure Rate:** <5% (with good UX and testing)

---

### Fallback Strategy: Manual Support (NOT Automated Server)

**Why NO automatic server-side fallback:**
- Defeats privacy promise ("files never leave device" becomes "sometimes they do")
- Requires infrastructure we're avoiding
- Confuses messaging ("is it private or not?")
- Adds complexity and cost

**Instead: Human-Assisted Fallback**

#### Option 1: Email Support (Primary Fallback)

**Process:**
1. User encounters error in client-side conversion
2. Error message displays: *"This file couldn't be automatically converted. Our team can help! Contact support@oleek.com with your video and we'll convert it for you within 24 hours."*
3. User emails support (or uses contact form)
4. Support team manually converts using desktop FFmpeg
5. Support uploads to temporary Google Drive/Dropbox link
6. User downloads, link expires in 7 days

**Consent & Privacy:**
- Explicit opt-in (user chooses to send file)
- Clear messaging: "By emailing your video, you agree to temporary upload"
- Link to privacy policy

**SLA:**
- Response within 24 hours
- Conversion within 48 hours (business days)

**Cost:**
- Staff time: ~15 minutes per conversion
- Estimate: 50 fallback conversions/month @ 500 total = 10%
- Staff cost: ~$200/month (part-time support)
- Still far cheaper than automated infrastructure

---

#### Option 2: Desktop App Download (Future Enhancement)

**For Power Users:**
- Provide downloadable Electron app (Windows/Mac)
- App runs FFmpeg locally (same privacy, no browser limits)
- Can handle files >2GB, faster processing
- Users who prefer desktop tools

**Implementation:**
- Version 2 feature (not launch requirement)
- Link on Convert page: "For very large files, download our desktop app"
- Still 100% local processing

---

### Data Retention & Deletion Policy

#### Client-Side (Primary Method):
**Data Collection:** NONE  
**Retention:** N/A (no data collected)  
**Deletion:** Automatic (browser memory cleared when tab closed)

**Privacy Statement:**
> "Your video is processed entirely in your web browser using WebAssembly technology. The file never uploads to our servers. All processing happens in your device's memory and is automatically cleared when you close the page. We have zero access to your video content."

---

#### Manual Support Fallback (User Opted-In):
**Data Collection:** Video file (with explicit user consent)  
**Storage Location:** Temporary cloud storage (Google Drive, Dropbox, or similar)  
**Retention Period:** Maximum 7 days  
**Deletion Process:** Automatic expiration of share link + manual deletion from storage  

**Privacy Statement (for manual support):**
> "When you contact support for manual conversion assistance, you are choosing to share your video file with our team. We will temporarily store your file in secure cloud storage (Google Drive) for up to 7 days while we process it. After 7 days, the file and all associated links are permanently deleted. We never share your video with third parties or use it for any purpose other than conversion. By requesting manual support, you consent to this temporary storage."

**User Controls:**
- User can request immediate deletion (email support)
- User can download and then delete link themselves
- Clear confirmation when file is deleted

**Staff Access:**
- Only designated support staff can access files
- Access logged and audited
- NDAs signed by all staff with access

**Compliance:**
- GDPR-compliant (explicit consent, purpose limitation, deletion)
- CCPA-compliant (user can request deletion)
- No sale of data (ever)

---

### Fallback Flow Diagram

```
User uploads video to client-side converter
↓
Client-side conversion attempt
↓
[Success 85-95%] → Download converted video → DONE ✓
↓
[Failure 5-15%] → Error message displayed
                  ↓
                  User sees two options:
                  
                  Option A: "Try a smaller/different file"
                  (User retries with optimized source)
                  
                  Option B: "Contact Support for Help"
                  (User emails video to support)
                  ↓
                  Support manually converts
                  ↓
                  Send link via email (7-day expiration)
                  ↓
                  User downloads
                  ↓
                  Auto-delete after 7 days
```

---

## 3. EXACT OUTPUT VIDEO SPECIFICATIONS

### Target Device Constraints

**OLEEK Memories Book Hardware:**
- Screen Resolution: 1024×600 pixels (16:9-ish, ~600p)
- Processor: Low-power ARM or similar (not high-end)
- Video Decoder: H.264 hardware acceleration (standard)
- Storage: FAT32 filesystem (4GB file size limit)
- Battery: 5000mAh (need efficient codecs to maximize playback time)

**Compatibility Requirements:**
- Must play smoothly without stuttering
- Must not drain battery excessively
- Must fit within storage capacity
- Must not require advanced codecs (H.265, VP9, AV1 unsupported)

---

### Output Specification

#### Container Format
**Container:** MP4 (MPEG-4 Part 14)  
**MIME Type:** `video/mp4`  
**File Extension:** `.mp4`

**Why MP4:**
- Universal compatibility (all devices, all players)
- Efficient container overhead (minimal bloat)
- Supports H.264 + AAC (our chosen codecs)
- Streaming-friendly (progressive download)

**MP4 Options:**
- **FastStart enabled** (`-movflags +faststart`)  
  - Moves metadata (moov atom) to beginning of file
  - Allows playback to start immediately (device doesn't need to read entire file first)
  - Critical for good user experience on device

---

#### Video Codec
**Codec:** H.264 / AVC (Advanced Video Coding)  
**FFmpeg Encoder:** `libx264`  
**Profile:** High  
**Level:** 4.1

**Why H.264:**
- Hardware decoding support (all modern devices have H.264 decoder chip)
- Excellent quality-to-filesize ratio
- Mature, stable, well-tested
- Lower power consumption than software-decoded formats (battery life)
- Better compatibility than newer codecs (H.265, VP9, AV1)

**Profile Details:**
- **High Profile:** Best compression for given quality, supports all H.264 features
- **Level 4.1:** Supports up to 1080p30 @ 20 Mbps (our target is well below this)

---

#### Resolution & Scaling

**Maximum Output Resolution:** 1920×1080 (1080p)  
**Recommended Output:** 1280×720 (720p) or 1920×1080 (1080p)

**Scaling Rules:**

| Input Resolution | Output Resolution | Action |
|-----------------|-------------------|--------|
| 4K (3840×2160) | 1920×1080 | Downscale (preserve quality) |
| 1080p (1920×1080) | 1920×1080 | Pass-through or light re-encode |
| 720p (1280×720) | 1280×720 | Pass-through or light re-encode |
| <720p (480p, etc.) | Keep original | No upscaling (degrades quality) |

**Scaling Algorithm:**
- **Lanczos** or **Bicubic** (high-quality downscaling)
- Preserve sharpness, avoid blurring

**FFmpeg Command:**
```bash
-vf "scale=w=1920:h=1080:force_original_aspect_ratio=decrease"
```
- `force_original_aspect_ratio=decrease`: Never upscale, only downscale if needed
- Maintains aspect ratio (no stretching)

---

#### Aspect Ratio Handling

**Device Screen:** 1024×600 (approximately 16:9, actually 1.71:1)  
**Target Aspect Ratio:** 16:9 (1.78:1) - closest standard

**Letterboxing/Pillarboxing:**

| Input Aspect Ratio | Action | Result |
|-------------------|--------|--------|
| 16:9 (1.78:1) | Pass-through | Perfect fit |
| 21:9 (2.35:1) Ultrawide | Add black bars top/bottom (letterbox) | Centered, no stretch |
| 4:3 (1.33:1) Old TV | Add black bars left/right (pillarbox) | Centered, no stretch |
| 9:16 (0.56:1) Vertical/Phone | Add black bars left/right (pillarbox) | Centered, no stretch |

**FFmpeg Command (Letterboxing):**
```bash
-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black"
```
- `scale=1920:1080:force_original_aspect_ratio=decrease`: Scale to fit within 1920×1080
- `pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black`: Add black padding to center
- Result: No stretching, professional appearance

**Why This Matters:**
- Preserves original aspect ratio (no distortion)
- Professional appearance (cinema-style letterboxing)
- Device will display correctly without further adjustment

---

#### Frame Rate

**Target Frame Rate:** 30 fps (frames per second)  
**Maximum Frame Rate:** 30 fps

**Frame Rate Conversion:**

| Input Frame Rate | Output Frame Rate | Action |
|-----------------|-------------------|--------|
| 60 fps (GoPro, gaming) | 30 fps | Drop every other frame |
| 50 fps (PAL) | 30 fps | Convert (slight speedup, imperceptible) |
| 30 fps (standard) | 30 fps | Pass-through |
| 24 fps (cinema) | 24 fps | Keep original (smooth playback) |
| 23.976 fps (NTSC film) | 23.976 fps | Keep original |

**FFmpeg Command:**
```bash
-r 30
```
- Forces 30 fps output
- Duplicates/drops frames as needed

**Why 30 fps:**
- Device has limited processing power (high frame rates = stuttering)
- 30 fps is smooth for most content (human eye barely notices vs 60 fps for non-gaming)
- Battery savings (less data to decode)
- Smaller file sizes

**Exception:**
- If source is 24 fps (cinema), keep 24 fps (no conversion needed, looks great)
- Most wedding videos are 30 fps or 60 fps (source)

---

#### Bitrate (Quality vs File Size)

**Target Video Bitrate:** 5 Mbps (5000 kbps)  
**Maximum Video Bitrate:** 8 Mbps (8000 kbps)  
**Encoding Mode:** Variable Bitrate (VBR) with Constant Rate Factor (CRF)

**Encoding Parameters:**

```bash
-c:v libx264 \
-crf 23 \
-preset medium \
-b:v 5000k \
-maxrate 8000k \
-bufsize 8000k
```

**Parameter Breakdown:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `-crf` | 23 | Constant Rate Factor (quality level: 18=visually lossless, 28=noticeable compression) |
| `-preset` | medium | Encoding speed vs compression efficiency (medium = good balance) |
| `-b:v` | 5000k | Target average bitrate (5 Mbps) |
| `-maxrate` | 8000k | Maximum bitrate ceiling (prevent spikes) |
| `-bufsize` | 8000k | Rate control buffer size (1 second of max bitrate) |

**Why These Values:**

**CRF 23:**
- High quality (most people can't distinguish from source)
- Good compression (smaller files)
- Standard "visually transparent" setting

**5 Mbps Average:**
- Excellent quality for 1080p content
- Comparable to DVD-quality video
- Smooth playback on low-power device
- Battery-efficient

**8 Mbps Max:**
- Prevents spikes that could cause stuttering
- Ensures consistent playback
- Device can comfortably decode up to 10 Mbps, so 8 Mbps has headroom

**File Size Estimate (5 Mbps):**
- 1 minute of video = ~37.5 MB
- 10 minutes = ~375 MB
- 1 hour = ~2.25 GB (within 4GB FAT32 limit)

**Comparison to 4K Source:**

| Source (4K @ 60 Mbps) | Output (1080p @ 5 Mbps) | Savings |
|-----------------------|-------------------------|---------|
| 1 hour = ~27 GB | 1 hour = ~2.25 GB | **92% smaller** |
| 10 min = ~4.5 GB | 10 min = ~375 MB | **92% smaller** |

---

#### Audio Codec

**Codec:** AAC (Advanced Audio Coding)  
**Profile:** AAC-LC (Low Complexity)  
**FFmpeg Encoder:** `aac` (native) or `libfdk_aac` (if available, higher quality)

**Audio Parameters:**

```bash
-c:a aac \
-b:a 128k \
-ar 44100 \
-ac 2
```

**Parameter Breakdown:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `-c:a` | aac | Audio codec (AAC) |
| `-b:a` | 128k | Audio bitrate (128 kbps) |
| `-ar` | 44100 | Sample rate (44.1 kHz, CD quality) |
| `-ac` | 2 | Audio channels (stereo) |

**Why AAC @ 128 kbps:**
- **AAC:** Best quality-to-size ratio for MP4 container
- **128 kbps:** Transparent quality for most content (near-CD quality)
- **44.1 kHz:** Standard sample rate (matches most source audio)
- **Stereo:** Device has stereo speakers

**Audio Channel Handling:**

| Input Channels | Output Channels | Action |
|---------------|-----------------|--------|
| Mono (1 channel) | Stereo (2) | Duplicate mono to both L+R |
| Stereo (2 channels) | Stereo (2) | Pass-through |
| 5.1 Surround (6 channels) | Stereo (2) | Downmix to stereo |
| 7.1 Surround (8 channels) | Stereo (2) | Downmix to stereo |

**FFmpeg Downmix (Surround → Stereo):**
- Automatic when `-ac 2` is specified
- Uses standard downmix matrix (preserves dialog, balances music)

---

#### Pixel Format

**Pixel Format:** `yuv420p` (YUV 4:2:0 planar)

**FFmpeg Command:**
```bash
-pix_fmt yuv420p
```

**Why yuv420p:**
- **Universal compatibility:** All devices support it
- **Required by some players:** Certain legacy players require yuv420p
- **Efficient:** 4:2:0 chroma subsampling (human eye less sensitive to color detail)
- **H.264 standard:** Most common pixel format for H.264

**Alternative (NOT used):**
- `yuv444p` (no chroma subsampling): Higher quality but incompatible with some devices, larger files
- `yuv422p` (4:2:2): Professional use, unnecessary for consumer device

---

### Complete FFmpeg Command Template

**Full Conversion Command:**

```bash
ffmpeg -i input.mov \
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

**Execution Time Estimate:**
- 10-minute 1080p source: 5-15 minutes conversion (depends on user's device)
- Real-time ratio: ~0.5x to 1.5x (varies by device CPU)

---

### File Size Comparison Examples

**Example 1: 10-Minute Wedding Highlight Reel**

| Source (4K @ 60 fps, 60 Mbps) | Output (1080p @ 30 fps, 5 Mbps) |
|-------------------------------|--------------------------------|
| 4.5 GB | 375 MB |
| Won't fit on 16GB device (max 3 files) | Fits easily (43 files @ 16GB) |
| **Savings: 92%** | |

**Example 2: 1-Hour Full Ceremony**

| Source (1080p @ 60 fps, 20 Mbps) | Output (1080p @ 30 fps, 5 Mbps) |
|----------------------------------|--------------------------------|
| 9 GB | 2.25 GB |
| Exceeds 4GB FAT32 limit (ERROR) | Within limit ✓ |
| **Savings: 75%** | |

---

### Quality Assurance Checklist

Before releasing any converted video, verify:
- [ ] Plays on actual OLEEK device (hardware test)
- [ ] No stuttering or lag during playback
- [ ] Audio is in sync (max 100ms drift)
- [ ] No visual artifacts (blockiness, banding)
- [ ] Aspect ratio correct (no stretching)
- [ ] File size reasonable (<4GB for FAT32)
- [ ] FastStart enabled (playback starts immediately)
- [ ] No audio dropouts or distortion

---

## 4. UX FLOW OF THE CONVERT PAGE

### User Journey: Start to Finish

#### Step 1: Page Load (Initial State)

**Visual Elements:**
```
┌─────────────────────────────────────────────────────────┐
│  OLEEK Video Converter                                   │
│  ────────────────────────────────────────────────────   │
│                                                          │
│  Convert Your Videos for Perfect Playback               │
│  Free • Fast • 100% Private                             │
│                                                          │
│  🔒 Your video never leaves your device                 │
│     Conversion happens in your browser                   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │         📁  Drag & drop video file here          │  │
│  │              or click to browse                   │  │
│  │                                                   │  │
│  │   Supports: MP4, MOV, AVI, MKV, WMV, M4V, WebM  │  │
│  │   Recommended: Files under 2GB for best results  │  │
│  │                                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ❓ Why convert?                                        │
│     • Ensures your video will play on OLEEK device      │
│     • Optimizes battery life                            │
│     • Prevents stuttering and sync issues               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**User Actions:**
- Drag-and-drop file onto dropzone
- OR click dropzone to open file browser
- Select video file from computer

---

#### Step 2: File Selected (Validation State)

**Visual Elements:**
```
┌─────────────────────────────────────────────────────────┐
│  File Selected: WeddingCeremony.mov                      │
│  Size: 1.2 GB  •  Format: MOV  •  Duration: 45:32      │
│                                                          │
│  ✅ File is compatible and ready to convert             │
│                                                          │
│  [  Convert Now  ]  [ Choose Different File ]          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Validation Checks:**
- ✅ File extension is supported (.mp4, .mov, etc.)
- ✅ File size <2GB (warn if larger, still allow)
- ✅ File is actually a video (MIME type check)
- ❌ If checks fail → Show error (see Error States below)

**User Actions:**
- Click "Convert Now" to start
- OR click "Choose Different File" to select another

---

#### Step 3: Loading FFmpeg Library (Initialization State)

**Visual Elements:**
```
┌─────────────────────────────────────────────────────────┐
│  Preparing Converter...                                  │
│                                                          │
│  [████████████░░░░░░░░] 60%                             │
│                                                          │
│  Loading conversion tools (~30 MB)                       │
│  This happens once, then it's cached for future use     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Timeline:**
- Duration: 3-10 seconds (varies by connection speed)
- Happens only on first conversion (cached afterwards)

**Technical:**
- Download ffmpeg.wasm core files (~30MB)
- Load into WebAssembly module
- Initialize in Web Worker

---

#### Step 4: Converting (Processing State)

**Visual Elements:**
```
┌─────────────────────────────────────────────────────────┐
│  Converting Your Video...                                │
│                                                          │
│  [████████████████████░░░░░░░░] 67%                    │
│                                                          │
│  Processed: 30:24 / 45:32                               │
│  Estimated time remaining: ~8 minutes                    │
│                                                          │
│  🔒 Processing in your browser - file never uploaded    │
│                                                          │
│  [ Cancel Conversion ]                                   │
│                                                          │
│  💡 Tip: Keep this tab open. You can browse other       │
│     tabs while conversion happens in the background.     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Progress Updates:**
- Update every 1-2 seconds
- Show percentage (0-100%)
- Show time processed / total duration
- Calculate and show estimated time remaining (ETA)

**User Actions:**
- Wait (can switch to other tabs, browser tab runs in background)
- OR click "Cancel" to abort conversion

**Technical:**
- FFmpeg progress events streamed from Web Worker
- Progress calculated: `(current_time / total_duration) * 100`
- ETA calculated: `(remaining_time / current_speed)`

---

#### Step 5: Success (Completion State)

**Visual Elements:**
```
┌─────────────────────────────────────────────────────────┐
│  ✅ Conversion Complete!                                │
│                                                          │
│  Your video is ready for the OLEEK Memories Book        │
│                                                          │
│  Original file: WeddingCeremony.mov (1.2 GB)            │
│  Converted file: WeddingCeremony_converted.mp4 (385 MB) │
│  ─────────────────────────────────────────────────────  │
│  File size reduced by 68% ⭐                             │
│                                                          │
│  [   Download Converted Video   ]                       │
│                                                          │
│  [ Convert Another Video ]                               │
│                                                          │
│  ───────────────────────────────────────────────────    │
│  Next Steps:                                             │
│  1. Download the converted video above                   │
│  2. Connect your OLEEK Memories Book to computer         │
│  3. Drag the converted file onto the device              │
│  4. Enjoy perfect playback!                              │
│                                                          │
│  Need help? → [Learn How to Load Videos](/learn)       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Automatic Actions:**
- Converted file automatically downloads (browser triggers download)
- OR provide manual download button if auto-download fails

**User Actions:**
- Download converted video
- Click "Convert Another Video" to start over
- Click link to Learn page for loading instructions

**Technical:**
- Create Blob from converted video data
- Create Blob URL
- Trigger download via `<a download>` element
- Clean up memory (delete Blob URL, terminate FFmpeg worker)

---

### Error States

#### Error 1: Unsupported File Type

**Trigger:** User selects image, PDF, or non-video file

**Visual:**
```
┌─────────────────────────────────────────────────────────┐
│  ❌ Unsupported File Type                               │
│                                                          │
│  The file you selected (document.pdf) is not a video.   │
│                                                          │
│  Please select a video file:                             │
│  • MP4, MOV, AVI, MKV, WMV, M4V, WebM                   │
│                                                          │
│  [ Try Again ]                                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

#### Error 2: File Too Large (Warning, Not Blocker)

**Trigger:** File >2GB selected

**Visual:**
```
┌─────────────────────────────────────────────────────────┐
│  ⚠️ Large File Warning                                  │
│                                                          │
│  Your file is 3.5 GB. Large files may:                  │
│  • Take a long time to convert (30+ minutes)            │
│  • Cause your browser to run out of memory              │
│  • Result in conversion failure                         │
│                                                          │
│  Recommendations:                                        │
│  • Try a shorter video segment (10-20 minutes)          │
│  • Use a desktop computer (not mobile)                   │
│  • Close other browser tabs to free memory              │
│                                                          │
│  [ Continue Anyway ]  [ Choose Smaller File ]          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

#### Error 3: Conversion Failed (During Processing)

**Trigger:** FFmpeg error, out of memory, corrupted file

**Visual:**
```
┌─────────────────────────────────────────────────────────┐
│  ❌ Conversion Failed                                   │
│                                                          │
│  We couldn't convert this video automatically.          │
│                                                          │
│  Possible reasons:                                       │
│  • File is corrupted or incomplete                       │
│  • Unsupported video codec (very rare)                   │
│  • Browser ran out of memory                            │
│                                                          │
│  What you can try:                                       │
│  ✓ Try a different video file                           │
│  ✓ Try on a desktop computer (more memory)              │
│  ✓ Close other browser tabs and retry                   │
│  ✓ Use a shorter video clip                             │
│                                                          │
│  Need help? Our team can convert it for you!            │
│                                                          │
│  [ Contact Support ]  [ Try Different File ]           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Contact Support Button:**
- Links to contact page or opens email client
- Pre-fills subject: "Video Conversion Assistance"
- Includes error code (for debugging)

---

#### Error 4: Browser Not Supported

**Trigger:** Browser doesn't support WebAssembly (very rare in 2026)

**Visual:**
```
┌─────────────────────────────────────────────────────────┐
│  ❌ Browser Not Supported                               │
│                                                          │
│  Your browser doesn't support the technology needed     │
│  for video conversion (WebAssembly).                     │
│                                                          │
│  Please use one of these browsers:                       │
│  • Google Chrome (version 57+)                           │
│  • Mozilla Firefox (version 52+)                         │
│  • Apple Safari (version 11+)                            │
│  • Microsoft Edge (version 16+)                          │
│                                                          │
│  Or contact support for manual conversion:               │
│  support@oleek.com                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### Mobile Considerations

**Mobile UX Adjustments:**

1. **File Selection:**
   - Use native file picker (camera roll, file manager)
   - Allow selection from photos app
   - Support camera capture (if desired)

2. **Performance Warning:**
   ```
   📱 Mobile Device Detected
   
   Converting large videos on mobile may be slow.
   For best results, use a computer.
   
   [ Continue ]  [ I'll use a computer ]
   ```

3. **Battery Warning:**
   ```
   🔋 This process may use significant battery.
   Please keep your device plugged in.
   ```

4. **Layout:**
   - Larger buttons (44px min touch target)
   - Simpler progress display (less detail)
   - Full-screen mode option (avoid distractions)

---

### Accessibility Considerations

**Screen Reader Support:**
- Progress updates announced every 10% (not every second, avoid spam)
- Success/error messages announced immediately
- Button labels descriptive ("Download converted video" not "Download")

**Keyboard Navigation:**
- File selection via Enter/Space on dropzone
- Tab through all interactive elements
- Escape key to cancel conversion

**Visual:**
- High contrast progress bar
- Large, readable text (16px minimum)
- Color not sole indicator (icons + text for errors/success)

---

## 5. PRIVACY & COMPLIANCE MESSAGING

### On-Page Privacy Statements

#### Primary Statement (Above Upload Area)

**Headline:**
```
🔒 Your Privacy is Our Priority
```

**Body:**
```
Your video is processed entirely in your web browser using advanced
WebAssembly technology. The file NEVER uploads to our servers or
any cloud service. All conversion happens in your device's memory
and is automatically cleared when you close this page.

We have ZERO access to your video content at any time.
```

**Why This Works:**
- Simple, non-technical language
- Clear negative ("NEVER uploads")
- Positive framing ("in your web browser")
- Reassurance ("automatically cleared")
- Bold commitment ("ZERO access")

---

#### Secondary Statement (Below Upload Area, Expandable)

**Link:** "How does this work? (Technical details)"

**Expanded Content:**
```
Technical Explanation:

When you select a video file, it's loaded into your browser's memory
(RAM) using the File API. We use FFmpeg.wasm, which is FFmpeg (the
industry-standard video processing tool) compiled to WebAssembly so
it runs directly in your browser.

The conversion process:
1. Your browser reads the video from your hard drive (no upload)
2. FFmpeg.wasm processes the video in a Web Worker (background thread)
3. The converted video is created in browser memory
4. You download it directly from your browser's memory
5. All data is cleared when you close the tab

Your original file is NEVER modified. The converted file only exists
in your browser's memory until you download it.

No data is transmitted to our servers. No data is stored anywhere.
This is as private as editing a file in Microsoft Word on your
computer - it's entirely local to your device.

Browser Developer Tools Proof:
Open your browser's Network tab (F12) and watch during conversion -
you'll see NO network requests uploading your video. Only the initial
download of the FFmpeg library (which is cached).
```

**Why This Works:**
- Transparent (shows exactly what happens)
- Educational (users learn about WebAssembly)
- Verifiable (users can check Network tab themselves)
- Analogies (like Microsoft Word = relatable)

---

#### Footer Disclaimer

**Small Print:**
```
By using this free conversion service, you agree to our
[Terms and Conditions](/terms).

Your video is processed locally in your browser and never uploaded.
See our [Privacy Policy](/privacy) for details.
```

---

### Comparison Messaging (vs Competitors)

**Optional Section on Convert Page:**

**Headline:**
```
Why is OLEEK's Converter Different?
```

**Comparison Table:**

| Feature | Other Services | OLEEK |
|---------|---------------|-------|
| **Privacy** | Upload to servers | ✅ Local processing only |
| **Speed** | Wait for upload + download | ✅ Instant (no upload/download) |
| **Data Storage** | Stored temporarily | ✅ Never stored anywhere |
| **Third Parties** | May use Google Drive, AWS | ✅ No third parties involved |
| **Cost** | Often paid or limited | ✅ 100% free, unlimited |

**Tagline:**
```
"Your memories are too precious to upload to strangers."
```

---

### Trust Signals

**Badges/Icons to Display:**

1. **Privacy Shield Icon:**
   ```
   🔒 Zero Upload Guarantee
   Your videos never leave your device
   ```

2. **Technology Badge:**
   ```
   ⚡ Powered by WebAssembly
   Advanced browser technology for local processing
   ```

3. **No Data Icon:**
   ```
   🚫 No Data Collection
   We can't see your videos because we never receive them
   ```

4. **Open Source Reference:**
   ```
   🔓 Built on FFmpeg
   Using trusted, open-source video processing
   ```

---

### FAQ Section on Convert Page

**Q: Is this really private?**
> Absolutely. Your video is processed using WebAssembly technology that runs entirely in your browser, just like how a calculator app on your phone doesn't send your calculations to the internet. The file never leaves your device. We couldn't see your video even if we wanted to - our servers never receive it.

**Q: How can I verify this?**
> Open your browser's Developer Tools (press F12), go to the Network tab, and watch during conversion. You'll see NO uploads of your video file. The only network activity is the one-time download of the FFmpeg library (which is cached for future use). This proves your video stays on your device.

**Q: What data do you collect?**
> We collect anonymous usage statistics (e.g., "a conversion was started," "a conversion completed") to help us improve the tool. We do NOT collect your video file, filename, video duration, or any personal information. Analytics are strictly limited to aggregate usage patterns.

**Q: What if I need manual help with conversion?**
> If the automatic tool doesn't work for your video, you can contact our support team at support@oleek.com. In that case, you would CHOOSE to send us your video via email, and we would convert it manually. This is 100% opt-in - we'll never ask for your video unless you contact us first. Files are deleted within 7 days.

---

### GDPR / CCPA Compliance

**Data Processing:**
- ✅ No personal data collected (no video content = no personal data)
- ✅ No cookies required (optional analytics cookies only)
- ✅ No user accounts (no login = no user data)
- ✅ No data retention (nothing to retain)

**Legal Basis:**
- Not applicable (no data processing of personal data)
- Analytics cookies: Legitimate interest + consent banner

**User Rights:**
- Right to access: N/A (no data stored)
- Right to deletion: N/A (no data stored)
- Right to portability: N/A (no data stored)
- Right to object: Can disable analytics cookies

**Cookie Consent Banner (if analytics used):**
```
🍪 We use cookies to understand how visitors use our site
(Google Analytics). No personal information is collected.

[Accept] [Reject] [Learn More]
```

---

### Marketing Language for Privacy

**Homepage:**
```
Free Video Converter
100% Private • Browser-Based • No Upload Required

Unlike other services that upload your intimate wedding videos to
their servers, OLEEK's converter processes everything locally on
your device. Your memories stay yours.
```

**Social Media:**
```
🔒 Privacy-first video conversion
Your wedding videos are too precious to upload to strangers.

Convert in your browser - no upload, no servers, no third parties.
Try it free: [link]
```

**Email Marketing:**
```
Subject: Your Wedding Videos Deserve Privacy

Did you know most video converters upload your files to their servers?

At OLEEK, we believe your intimate memories should never leave your
device. That's why we built our converter using advanced browser
technology - no upload required, ever.

Try it free: [link]
```

---

### Trust-Building Copy

**Why Trust Matters:**
- Wedding videos are deeply personal and intimate
- Couples spent thousands on videography
- Fear of data breach, misuse, or embarrassment
- Privacy is a core value, not a feature

**Messaging Principles:**
1. **Lead with privacy** (not speed or quality)
2. **Be specific** ("browser-based" not "secure")
3. **Use negatives** ("never upload" is stronger than "keep private")
4. **Offer proof** ("check your Network tab")
5. **Contrast with competitors** (educate users about industry norms)

---

**END OF ARCHITECTURE & DESIGN DOCUMENT**

This document provides the complete technical and UX architecture for OLEEK's video conversion service. It prioritizes privacy as a core differentiator while maintaining technical feasibility and excellent user experience.

**Next Step:** Implementation of client-side converter in Next.js with ffmpeg.wasm.
