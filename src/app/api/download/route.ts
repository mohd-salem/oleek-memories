import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, OUTPUT_BUCKET } from '@/lib/aws/s3-client';
import { jobStore } from '@/lib/aws/job-store';

export async function GET(request: NextRequest) {
  try {
    const fileId = request.nextUrl.searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { error: 'Missing fileId parameter' },
        { status: 400 }
      );
    }

    const jobInfo = jobStore.get(fileId);

    if (!jobInfo) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (jobInfo.status !== 'COMPLETE') {
      return NextResponse.json(
        { error: `Conversion not complete. Status: ${jobInfo.status}` },
        { status: 400 }
      );
    }

    // List files in the output folder to find the actual output file
    const listCommand = new ListObjectsV2Command({
      Bucket: OUTPUT_BUCKET,
      Prefix: `${fileId}/`,
    });

    const listResponse = await s3Client.send(listCommand);
    const outputFiles = listResponse.Contents?.filter(
      (obj) => obj.Key?.endsWith('.mp4')
    );

    if (!outputFiles || outputFiles.length === 0) {
      return NextResponse.json(
        { error: 'Output file not found' },
        { status: 404 }
      );
    }

    // Use the first MP4 file found
    const actualOutputKey = outputFiles[0].Key!;

    // Extract original filename from input key and add "converted"
    const originalFilename = jobInfo.inputKey.split('/').pop() || 'video.mp4';
    const fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
    const baseName = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
    const downloadFilename = `${baseName}-converted${fileExtension}`;

    // Generate signed download URL (expires in 1 hour)
    // Force download instead of playing in browser
    const command = new GetObjectCommand({
      Bucket: OUTPUT_BUCKET,
      Key: actualOutputKey,
      ResponseContentDisposition: `attachment; filename="${downloadFilename}"`,
      ResponseContentType: 'video/mp4',
    });

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    return NextResponse.json({
      downloadUrl,
      filename: downloadFilename,
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate download link' },
      { status: 500 }
    );
  }
}
