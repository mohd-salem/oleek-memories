import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, OUTPUT_BUCKET } from '@/lib/aws/s3-client';

export async function GET(request: NextRequest) {
  try {
    const fileId = request.nextUrl.searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { error: 'Missing fileId parameter' },
        { status: 400 }
      );
    }

    // MediaConvert always outputs to ${fileId}/output.mp4
    const outputKey = `${fileId}/output.mp4`;

    console.log('🔍 Checking for file:', { fileId, outputKey, bucket: OUTPUT_BUCKET });

    // Check if file exists
    try {
      await s3Client.send(new HeadObjectCommand({
        Bucket: OUTPUT_BUCKET,
        Key: outputKey,
      }));
      console.log('✅ File found in S3:', outputKey);
    } catch (err) {
      console.error('❌ File not found in S3:', { 
        fileId, 
        outputKey, 
        bucket: OUTPUT_BUCKET,
        error: err instanceof Error ? err.message : String(err)
      });
      return NextResponse.json(
        { error: 'Output file not found. Conversion may not be complete yet.' },
        { status: 404 }
      );
    }

    // Generate download filename
    const downloadFilename = `${fileId}-converted.mp4`;

    // Generate signed download URL (expires in 1 hour)
    // Force download instead of playing in browser
    const command = new GetObjectCommand({
      Bucket: OUTPUT_BUCKET,
      Key: outputKey,
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
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
