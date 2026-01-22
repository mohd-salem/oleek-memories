# AWS Video Conversion - Deployment Guide

## Overview

OLEEK's video converter uses **AWS S3 + MediaConvert** for professional, fast video conversion (30 seconds vs 3-5 minutes with local processing).

## Architecture

```
User Upload → S3 Input Bucket → MediaConvert Job → S3 Output Bucket → Download
                                       ↓
                                 IAM Role (S3 Access)
```

## AWS Services Used

- **S3**: Two buckets for input/output files with 24-hour auto-deletion
- **MediaConvert**: Professional video encoding service
- **IAM**: User and role for secure access

## Current Setup

### S3 Buckets
- **Input**: `oleek-video-input` (us-east-1)
- **Output**: `oleek-video-output` (us-east-1)
- **Lifecycle**: Auto-delete files after 24 hours
- **CORS**: Configured for localhost:3000, localhost:3001

### IAM Configuration
- **User**: `oleek-nextjs` (access keys in .env.local)
- **Role**: `OLEEKMediaConvertRole` (ARN: arn:aws:iam::586091292918:role/OLEEKMediaConvertRole)

### IAM User Permissions
The `oleek-nextjs` user has these inline policies:

1. **MediaConvertPassRole** - Allows passing the MediaConvert role
2. **S3OutputBucketRead** - Read access to output bucket
3. **MediaConvertAccess** - Full MediaConvert access
4. **S3BucketsAccess** - Upload to input, list/read from output

### Video Output Specs
- **Container**: MP4
- **Video Codec**: H.264 (AVC), MAIN profile
- **Resolution**: 1920x1080 (1080p)
- **Frame Rate**: 30 fps
- **Bitrate**: QVBR mode, max 5 Mbps, quality level 8
- **Audio Codec**: AAC, 192 kbps, 48kHz, stereo
- **Aspect Ratio**: 16:9 (letterboxed if needed)

## Environment Variables

Required in `.env.local`:

```env
# AWS Credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAYQ5ODND3EF4OYO4R
AWS_SECRET_ACCESS_KEY=<your-secret-key>

# S3 Buckets
AWS_S3_INPUT_BUCKET=oleek-video-input
AWS_S3_OUTPUT_BUCKET=oleek-video-output

# MediaConvert
AWS_MEDIACONVERT_ROLE_ARN=arn:aws:iam::586091292918:role/OLEEKMediaConvertRole
```

## API Endpoints

### 1. POST /api/upload-url
Generates presigned S3 upload URL.

**Request:**
```json
{
  "fileId": "abc123",
  "filename": "video.mp4",
  "contentType": "video/mp4"
}
```

**Response:**
```json
{
  "uploadUrl": "https://s3...",
  "fileId": "abc123",
  "key": "abc123/video.mp4"
}
```

### 2. POST /api/convert
Creates MediaConvert job.

**Request:**
```json
{
  "fileId": "abc123",
  "inputKey": "abc123/video.mp4"
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "1769104159870-y9dpl2",
  "fileId": "abc123"
}
```

### 3. GET /api/status?fileId=abc123
Checks conversion progress.

**Response:**
```json
{
  "status": "COMPLETE",
  "progress": 100,
  "outputKey": "abc123/output.mp4"
}
```

Status values: `SUBMITTED`, `PROGRESSING`, `COMPLETE`, `ERROR`, `CANCELED`

### 4. GET /api/download?fileId=abc123
Generates signed download URL.

**Response:**
```json
{
  "downloadUrl": "https://s3...",
  "filename": "video-converted.mp4"
}
```

## Frontend Flow

1. User selects video file
2. Upload to S3 using presigned URL
3. Create MediaConvert job
4. Poll `/api/status` every 1 second
5. When COMPLETE, download converted video

## Cost Estimation

**Per 1-minute video:**
- S3 storage (24 hours): ~$0.000001
- S3 PUT/GET requests: ~$0.000005
- MediaConvert (1080p): ~$0.015
- **Total: ~$0.015 per video**

**Monthly (1000 videos):**
- ~$15/month for 1000 one-minute videos

## Production Deployment

### Required Changes

1. **Update CORS in S3:**
   ```json
   {
     "AllowedOrigins": ["https://yourdomain.com"],
     "AllowedMethods": ["GET", "PUT", "POST"],
     "AllowedHeaders": ["*"],
     "MaxAgeSeconds": 3000
   }
   ```

2. **Set environment variables** on hosting platform (Railway, Render, DigitalOcean)

3. **Monitor costs** in AWS Cost Explorer

4. **Consider CloudFront** for faster downloads globally

### Security Best Practices

- ✅ Use presigned URLs (time-limited)
- ✅ Validate file types and sizes (2GB max)
- ✅ Auto-delete files after 24 hours
- ✅ IAM least-privilege permissions
- ✅ Secure access keys in environment variables
- ⚠️ Add rate limiting for production
- ⚠️ Add user authentication for production

## Troubleshooting

### MediaConvert "Job not found" error
- **Cause**: In-memory job store cleared by Next.js hot reload
- **Solution**: Job store now uses global variable (persists across reloads)

### Download opens in browser instead of downloading
- **Cause**: Missing Content-Disposition header
- **Solution**: Added `ResponseContentDisposition: "attachment"` to S3 GetObject

### File not found in S3
- **Cause**: MediaConvert output filename mismatch
- **Solution**: List S3 bucket files and use first .mp4 found

### Permission denied errors
- **Cause**: Missing IAM permissions
- **Solution**: Verify all 4 inline policies on `oleek-nextjs` user

## Files Structure

```
src/
├── app/
│   ├── convert/
│   │   └── page.tsx                    # Convert page
│   └── api/
│       ├── upload-url/route.ts         # Generate S3 upload URL
│       ├── convert/route.ts            # Create MediaConvert job
│       ├── status/route.ts             # Check job status
│       └── download/route.ts           # Generate download URL
├── components/
│   └── convert/
│       └── ConvertPageAWS.tsx          # Frontend UI
└── lib/
    └── aws/
        ├── s3-client.ts                # S3 configuration
        ├── mediaconvert-client.ts      # MediaConvert configuration
        ├── job-store.ts                # In-memory job tracking
        └── validation/
            └── file-validator.ts       # File validation
```

## Next Steps

1. ✅ AWS MediaConvert activated and working
2. ✅ File download with proper naming
3. ✅ Production-ready code (debug logs removed)
4. 🔄 Test with various video formats
5. 🔄 Add error handling UI
6. 🔄 Deploy to production hosting
7. 🔄 Monitor costs and performance

## Support

For AWS-related issues:
- AWS Support Console: https://console.aws.amazon.com/support/
- MediaConvert Documentation: https://docs.aws.amazon.com/mediaconvert/
