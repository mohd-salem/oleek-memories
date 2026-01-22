import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';
import { s3Client, INPUT_BUCKET } from '@/lib/aws/s3-client';
import { sanitizeFilename } from '@/lib/validation/file-validator';

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing filename or contentType' },
        { status: 400 }
      );
    }

    // Generate unique file ID
    const fileId = nanoid();
    const sanitized = sanitizeFilename(filename);
    const key = `${fileId}/${sanitized}`;

    // Generate presigned URL for PUT upload (expires in 1 hour)
    const command = new PutObjectCommand({
      Bucket: INPUT_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    return NextResponse.json({
      fileId,
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
