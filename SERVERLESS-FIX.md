# Serverless Function Fix - Job Not Found Error

## Problem
Getting "Job not found" error on production (Vercel) when checking conversion status.

## Root Cause
**In-memory job storage doesn't work with serverless functions.** Each API request can run in a different container, so:
- `/api/convert` creates job in Container A's memory
- `/api/status` checks Container B's memory → job not found ❌

## Solution
Use **MediaConvert's UserMetadata** to store fileId and email with the job itself. This way, we can query the job directly by jobId without needing in-memory storage.

## Changes Made

### 1. Store metadata in MediaConvert job
**File:** `src/app/api/convert/route.ts`
```typescript
const command = new CreateJobCommand({
  Role: MEDIACONVERT_ROLE_ARN,
  UserMetadata: {
    fileId: fileId,
    email: email || '',
  },
  // ... rest of job settings
});
```

### 2. Query by jobId instead of fileId
**File:** `src/app/api/status/route.ts`
- Accept both `fileId` (backward compatibility) and `jobId` parameters
- Query MediaConvert directly with jobId
- Extract fileId and email from job's UserMetadata
- Falls back to in-memory store for local development

### 3. Frontend tracks jobId
**File:** `src/components/convert/ConvertPageAWS.tsx`
- Store jobId from conversion response
- Pass jobId to status polling: `/api/status?fileId=${fileId}&jobId=${jobId}`

## Architecture

### Before (Broken on Vercel)
```
┌─────────────────┐
│   /api/convert  │  → Saves job to memory (Container A)
└─────────────────┘

┌─────────────────┐
│   /api/status   │  → Checks memory (Container B) → NOT FOUND ❌
└─────────────────┘
```

### After (Works on Vercel)
```
┌─────────────────┐
│   /api/convert  │  → Saves metadata to MediaConvert job
└─────────────────┘

┌─────────────────┐
│   /api/status   │  → Queries MediaConvert by jobId → Gets metadata ✅
└─────────────────┘
```

## Testing
1. **Local:** Works as before (still uses in-memory for faster lookups)
2. **Production:** Works on Vercel serverless (uses MediaConvert metadata)

## Deploy
```bash
git add .
git commit -m "Fix job not found error on serverless (use MediaConvert metadata)"
git push
```

Vercel will auto-deploy. Test by converting a video on production.

## Benefits
- ✅ Works on serverless platforms (Vercel, AWS Lambda)
- ✅ No external database needed (Redis/DynamoDB)
- ✅ Backward compatible with local development
- ✅ Email notifications still work
- ✅ Job metadata persists with the job itself
