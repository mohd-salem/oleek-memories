# AWS Setup via Console (No CLI Required)

Complete AWS setup using only the web browser.

## Step 1: Create S3 Buckets

1. Go to https://s3.console.aws.amazon.com
2. Click **Create bucket**
3. **Input bucket:**
   - Bucket name: `oleek-video-input`
   - Region: `us-east-1`
   - **Block all public access**: ✅ (leave checked)
   - Click **Create bucket**
4. **Output bucket:**
   - Bucket name: `oleek-video-output`
   - Region: `us-east-1`
   - **Block all public access**: ✅ (leave checked)
   - Click **Create bucket**

## Step 2: Configure S3 Lifecycle Policies

**For oleek-video-input:**
1. Click on `oleek-video-input` bucket
2. Go to **Management** tab
3. Click **Create lifecycle rule**
4. Rule name: `DeleteAfter24Hours`
5. Rule scope: ✅ **Apply to all objects**
6. **Lifecycle rule actions:**
   - ✅ Expire current versions of objects
   - ✅ Delete expired object delete markers
   - ✅ Delete incomplete multipart uploads
7. **Expire current versions:** `1` days
8. **Delete incomplete multipart uploads:** `1` days
9. Click **Create rule**

**Repeat for oleek-video-output bucket**

## Step 3: Configure CORS for Input Bucket

1. Click on `oleek-video-input` bucket
2. Go to **Permissions** tab
3. Scroll to **Cross-origin resource sharing (CORS)**
4. Click **Edit**
5. Paste:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```
6. Click **Save changes**

## Step 4: Create IAM Role for MediaConvert

1. Go to https://console.aws.amazon.com/iam/
2. Click **Roles** → **Create role**
3. **Trusted entity type:** AWS service
4. **Use case:** Select **MediaConvert** (search for it)
5. Click **Next**
6. Click **Next** (skip permissions for now)
7. **Role name:** `OLEEKMediaConvertRole`
8. Click **Create role**

**Add S3 permissions:**
1. Click on `OLEEKMediaConvertRole`
2. Click **Add permissions** → **Create inline policy**
3. Click **JSON** tab
4. Paste:
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
5. Click **Next**
6. Policy name: `S3Access`
7. Click **Create policy**

**Copy Role ARN:**
- Copy the **ARN** (looks like `arn:aws:iam::123456789012:role/OLEEKMediaConvertRole`)
- Save it for .env.local

## Step 5: Create IAM User for Next.js

1. Go to https://console.aws.amazon.com/iam/
2. Click **Users** → **Create user**
3. User name: `oleek-nextjs`
4. Click **Next**
5. Select **Attach policies directly**
6. Click **Create policy** (opens new tab)

**In new tab:**
1. Click **JSON** tab
2. Paste:
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
3. Click **Next**
4. Policy name: `OLEEKNextJSPolicy`
5. Click **Create policy**

**Back to user creation tab:**
1. Refresh policy list
2. Search and select `OLEEKNextJSPolicy`
3. Click **Next**
4. Click **Create user**

**Create access key:**
1. Click on `oleek-nextjs` user
2. Go to **Security credentials** tab
3. Scroll to **Access keys**
4. Click **Create access key**
5. Select **Application running outside AWS**
6. Click **Next**
7. (Optional) Description: "Next.js video converter"
8. Click **Create access key**
9. **⚠️ SAVE THESE IMMEDIATELY:**
   - Access key ID
   - Secret access key
10. Click **Done**
11. 

## Step 6: Get MediaConvert Endpoint

1. Go to https://console.aws.amazon.com/mediaconvert/
2. **First-time setup:** If you see a "Get started" page, click **Get started** to activate MediaConvert for your account (free, one-time activation)
3. Wait for activation to complete (takes a few seconds)
4. In the left sidebar, click **Account**
5. Copy the **API endpoint** (looks like `https://xxxxx.mediaconvert.us-east-1.amazonaws.com`)
6. Save it for .env.local

**Note:** The error `SubscriptionRequiredException` means MediaConvert isn't activated yet. Just visit the console URL above and click "Get started" to activate it.

## Step 7: Configure Environment Variables

Create `.env.local` in your project root:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA... (from Step 5)
AWS_SECRET_ACCESS_KEY=... (from Step 5)
AWS_S3_INPUT_BUCKET=oleek-video-input
AWS_S3_OUTPUT_BUCKET=oleek-video-output
AWS_MEDIACONVERT_ENDPOINT=https://xxxxx.mediaconvert.us-east-1.amazonaws.com (from Step 6)
AWS_MEDIACONVERT_ROLE_ARN=arn:aws:iam::123456789012:role/OLEEKMediaConvertRole (from Step 4)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 8: Update Convert Page

Open `src/app/convert/page.tsx` and replace with:
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

## Step 9: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000/convert and test the conversion!

---

## Cost Estimate

Assuming 1000 conversions/month of 5-minute videos:
- MediaConvert: ~$0.015/min × 5 min × 1000 = $75/month
- S3 storage: ~$2/month (24hr retention)
- S3 data transfer: Varies by download volume

**Total: ~$80-100/month for moderate usage**

## Troubleshooting

**"Access Denied" errors:**
- Check IAM user has correct policy attached
- Verify bucket names match exactly in policy and .env.local
- Ensure MediaConvert role has S3 access

**CORS errors:**
- Check allowed origins in bucket CORS config
- Include both http://localhost:3000 AND your production domain

**MediaConvert job fails:**
- Verify role ARN is correct in .env.local
- Check MediaConvert role has S3 permissions
- Ensure buckets are in same region as MediaConvert (us-east-1)
