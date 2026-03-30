import { NextRequest, NextResponse } from 'next/server';
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
import { s3Client, INPUT_BUCKET } from '@/lib/aws/s3-client';
import { sanitizeFilename } from '@/lib/validation/file-validator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    switch (action) {
      case 'create': {
        const { filename, contentType } = body;
        if (!filename || !contentType) {
          return NextResponse.json(
            { error: 'Missing filename or contentType' },
            { status: 400 }
          );
        }

        // Validate content type is a video
        if (!contentType.startsWith('video/') && contentType !== 'application/octet-stream') {
          return NextResponse.json(
            { error: 'Invalid content type. Only video files are accepted.' },
            { status: 400 }
          );
        }

        const fileId = nanoid();
        const sanitized = sanitizeFilename(filename);
        const key = `${fileId}/${sanitized}`;

        const command = new CreateMultipartUploadCommand({
          Bucket: INPUT_BUCKET,
          Key: key,
          ContentType: contentType,
        });

        const response = await s3Client.send(command);

        if (!response.UploadId) {
          throw new Error('Failed to create multipart upload');
        }

        return NextResponse.json({ fileId, key, uploadId: response.UploadId });
      }

      case 'part-url': {
        const { key, uploadId, partNumber } = body;
        if (!key || !uploadId || !partNumber) {
          return NextResponse.json(
            { error: 'Missing key, uploadId, or partNumber' },
            { status: 400 }
          );
        }

        // Validate partNumber is in valid range (1-10000)
        const pNum = parseInt(String(partNumber), 10);
        if (isNaN(pNum) || pNum < 1 || pNum > 10000) {
          return NextResponse.json(
            { error: 'Invalid partNumber. Must be between 1 and 10000.' },
            { status: 400 }
          );
        }

        const command = new UploadPartCommand({
          Bucket: INPUT_BUCKET,
          Key: key,
          UploadId: uploadId,
          PartNumber: pNum,
        });

        const rawSignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600, // 1 hour per part
        });

        // AWS SDK v3 embeds a CRC32 checksum computed against an *empty* body
        // into presigned UploadPart URLs (e.g. X-Amz-Checksum-Crc32=AAAAAA==).
        // When the browser sends the real binary chunk, S3 validates the checksum,
        // sees a mismatch, and resets the connection → ERR_NETWORK_IO_SUSPENDED.
        // Strip any checksum-related query parameters before returning the URL.
        const urlObj = new URL(rawSignedUrl);
        const checksumKeys: string[] = [];
        urlObj.searchParams.forEach((_, key) => {
          if (key.toLowerCase().includes('checksum')) {
            checksumKeys.push(key);
          }
        });
        checksumKeys.forEach((key) => urlObj.searchParams.delete(key));
        const signedUrl = urlObj.toString();

        return NextResponse.json({ signedUrl });
      }

      case 'complete': {
        const { key, uploadId, parts } = body;
        if (!key || !uploadId || !Array.isArray(parts) || parts.length === 0) {
          return NextResponse.json(
            { error: 'Missing key, uploadId, or parts' },
            { status: 400 }
          );
        }

        // Validate parts structure
        for (const part of parts) {
          if (!part.ETag || !part.PartNumber) {
            return NextResponse.json(
              { error: 'Each part must have ETag and PartNumber' },
              { status: 400 }
            );
          }
        }

        const command = new CompleteMultipartUploadCommand({
          Bucket: INPUT_BUCKET,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: { Parts: parts },
        });

        await s3Client.send(command);
        return NextResponse.json({ success: true });
      }

      case 'abort': {
        const { key, uploadId } = body;
        if (!key || !uploadId) {
          return NextResponse.json(
            { error: 'Missing key or uploadId' },
            { status: 400 }
          );
        }

        const command = new AbortMultipartUploadCommand({
          Bucket: INPUT_BUCKET,
          Key: key,
          UploadId: uploadId,
        });

        await s3Client.send(command);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Multipart upload error:', error);
    return NextResponse.json(
      { error: 'Multipart upload operation failed' },
      { status: 500 }
    );
  }
}
