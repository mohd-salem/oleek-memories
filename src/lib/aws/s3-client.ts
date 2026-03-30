import { S3Client } from '@aws-sdk/client-s3';

if (!process.env.AWS_REGION) {
  throw new Error('AWS_REGION is required');
}
if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error('AWS_ACCESS_KEY_ID is required');
}
if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS_SECRET_ACCESS_KEY is required');
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Prevent SDK from embedding CRC32 checksums in presigned URLs.
  // When WHEN_SUPPORTED (default), the SDK adds a checksum computed
  // against an empty body, which causes S3 to reject the actual upload.
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

export const INPUT_BUCKET = process.env.AWS_S3_INPUT_BUCKET!;
export const OUTPUT_BUCKET = process.env.AWS_S3_OUTPUT_BUCKET!;
