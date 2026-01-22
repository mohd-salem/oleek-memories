# AWS Video Conversion - Complete Setup Guide

## Architecture Summary

**Flow:**
1. User selects video → Frontend requests presigned upload URL from `/api/upload-url`
2. Frontend uploads directly to S3 (bypassing Next.js server)
3. Frontend calls `/api/convert` to start MediaConvert job
4. Frontend polls `/api/status` every 3 seconds for progress
5. When complete, frontend gets signed download URL from `/api/download`
6. User downloads converted video (link expires in 1 hour)
7. S3 Lifecycle policies auto-delete files after 24 hours

## AWS Services Used

- **S3**: Input and output file storage
- **MediaConvert**: Professional video transcoding
- **IAM**: Permissions and roles

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Node.js 18+
- Next.js 14+ project

## Step 1: Create S3 Buckets

```bash
# Create input bucket
aws s3 mb s3://oleek-video-input --region us-east-1

# Create output bucket
aws s3 mb s3://oleek-video-output --region us-east-1
```

## Step 2: Configure S3 Lifecycle Policies

Create `s3-lifecycle-policy.json`:
```json
{
  "Rules": [
    {
      "Id": "DeleteAfter24Hours",
      "Status": "Enabled",
      "Prefix": "",
      "Expiration": {
        "Days": 1
      },
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 1
      },
      "AbortIncompleteMultipartUpload": {
        "DaysAfterInitiation": 1
      }
    }
  ]
}
```

Apply to both buckets:
```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket oleek-video-input \
  --lifecycle-configuration file://s3-lifecycle-policy.json

aws s3api put-bucket-lifecycle-configuration \
  --bucket oleek-video-output \
  --lifecycle-configuration file://s3-lifecycle-policy.json
```

## Step 3: Configure CORS for Direct Upload

Create `s3-cors.json`:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": [
      "https://yourdomain.com",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Apply to input bucket:
```bash
aws s3api put-bucket-cors \
  --bucket oleek-video-input \
  --cors-configuration file://s3-cors.json
```

## Step 4: Create IAM Role for MediaConvert

Create `mediaconvert-trust-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "mediaconvert.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Create `mediaconvert-permissions.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::oleek-video-input",
        "arn:aws:s3:::oleek-video-input/*",
        "arn:aws:s3:::oleek-video-output",
        "arn:aws:s3:::oleek-video-output/*"
      ]
    }
  ]
}
```

Create the role:
```bash
# Create role
aws iam create-role \
  --role-name OLEEKMediaConvertRole \
  --assume-role-policy-document file://mediaconvert-trust-policy.json

# Attach permissions
aws iam put-role-policy \
  --role-name OLEEKMediaConvertRole \
  --policy-name S3Access \
  --policy-document file://mediaconvert-permissions.json

# Get role ARN (save this!)
aws iam get-role --role-name OLEEKMediaConvertRole --query 'Role.Arn' --output text
```

## Step 5: Create IAM User for Next.js

Create `nextjs-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::oleek-video-input/*",
        "arn:aws:s3:::oleek-video-output/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "mediaconvert:CreateJob",
        "mediaconvert:GetJob",
        "mediaconvert:ListJobs"
      ],
      "Resource": "*"
    }
  ]
}
```

Create user and get credentials:
```bash
# Create user
aws iam create-user --user-name oleek-nextjs

# Attach policy
aws iam put-user-policy \
  --user-name oleek-nextjs \
  --policy-name OLEEKNextJSPolicy \
  --policy-document file://nextjs-policy.json

# Create access key
aws iam create-access-key --user-name oleek-nextjs
```

**Save the AccessKeyId and SecretAccessKey!**

## Step 6: Get MediaConvert Endpoint

```bash
aws mediaconvert describe-endpoints --region us-east-1
```

Save the endpoint URL (e.g., `https://xxxxx.mediaconvert.us-east-1.amazonaws.com`)

## Step 7: Configure Environment Variables

Create `.env.local`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_INPUT_BUCKET=oleek-video-input
AWS_S3_OUTPUT_BUCKET=oleek-video-output
AWS_MEDIACONVERT_ENDPOINT=https://xxxxx.mediaconvert.us-east-1.amazonaws.com
AWS_MEDIACONVERT_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT:role/OLEEKMediaConvertRole
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 8: Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @aws-sdk/client-mediaconvert nanoid
```

## Step 9: Update Convert Page

Replace `src/app/convert/page.tsx`:
```typescript
import ConvertPageAWS from '@/components/convert/ConvertPageAWS';

export const metadata = {
  title: 'Convert Videos | OLEEK Memories Book',
  description: 'Convert your videos for OLEEK memory books',
};

export default function ConvertPage() {
  return <ConvertPageAWS />;
}
```

## Step 10: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000/convert and test:
1. Upload a video file
2. Watch progress
3. Download converted file

## Step 11: Deploy

**Important:** This solution requires a Node.js server. Deploy to:
- Railway: `railway up`
- Render: Connect GitHub repo
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- AWS ECS/Fargate

**DO NOT deploy to Vercel** (MediaConvert requires persistent server)

Update `.env.local` on production with:
- Production domain in NEXT_PUBLIC_APP_URL
- Update CORS origins in S3 bucket

## Security Checklist

✅ **S3 Buckets**: Private (no public access)
✅ **CORS**: Only allows your domain
✅ **Presigned URLs**: Expire in 1 hour
✅ **Download URLs**: Expire in 1 hour
✅ **File Lifecycle**: Auto-delete after 24 hours
✅ **IAM**: Least privilege access
✅ **File Validation**: Size and type checks
✅ **Rate Limiting**: TODO - Add in production (e.g., Upstash Rate Limit)

## Cost Estimation (AWS)

Assuming 1000 conversions/month:
- **MediaConvert**: ~$0.015/min HD → ~$15-30/month
- **S3 Storage**: Minimal (24hr retention) → ~$1-5/month
- **S3 Data Transfer**: ~$9/100GB → varies
- **Total**: ~$25-50/month for moderate usage

## Monitoring

Add CloudWatch alarms for:
- Failed MediaConvert jobs
- S3 bucket size (detect cleanup issues)
- API error rates

## Privacy Policy Snippet

```
Video Processing & Privacy

When you use our video conversion service:

1. Upload & Processing: Your videos are uploaded directly to secure AWS S3 
   storage and processed using AWS MediaConvert for device compatibility.

2. Temporary Storage: Input and output files are automatically deleted from 
   our servers after 24 hours. Download links expire after 1 hour.

3. No Retention: We do not store, view, or share your videos. Once deleted, 
   they cannot be recovered.

4. Encryption: All files are encrypted at rest and in transit using AWS 
   security standards.

5. No Tracking: We do not track video content or create user profiles.

For questions about data processing, contact privacy@oleek.com
```

## Troubleshooting

**Error: "Failed to get upload URL"**
- Check AWS credentials in .env.local
- Verify IAM user has S3 PutObject permission

**Error: "Failed to start conversion"**
- Check MediaConvert endpoint is correct
- Verify MediaConvert role ARN
- Check MediaConvert role has S3 access

**Video stuck at 0%**
- Check S3 bucket CORS configuration
- Verify file uploaded successfully in S3 console
- Check CloudWatch Logs for MediaConvert job errors

**Download link not working**
- Verify output file exists in S3 output bucket
- Check bucket permissions
- Ensure signed URL hasn't expired

## Next Steps

1. Add rate limiting (e.g., Upstash)
2. Add email notifications on completion
3. Add webhook support for real-time status
4. Add analytics for conversion metrics
5. Implement cleanup monitoring
