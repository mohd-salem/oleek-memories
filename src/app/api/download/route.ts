import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
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

    console.log('🔍 Looking for output files in folder:', { fileId, bucket: OUTPUT_BUCKET });

    // List all files in the output folder
    const listCommand = new ListObjectsV2Command({
      Bucket: OUTPUT_BUCKET,
      Prefix: `${fileId}/`,
    });

    const listResponse = await s3Client.send(listCommand);
    
    console.log('📁 Files found in S3:', {
      fileId,
      files: listResponse.Contents?.map(obj => obj.Key) || [],
      count: listResponse.Contents?.length || 0,
    });

    // Find MP4 files
    const mp4Files = listResponse.Contents?.filter(
      (obj) => obj.Key?.endsWith('.mp4')
    );

    if (!mp4Files || mp4Files.length === 0) {
      console.error('❌ No MP4 files found in folder:', {
        fileId,
        prefix: `${fileId}/`,
        allFiles: listResponse.Contents?.map(obj => obj.Key),
      });
      return NextResponse.json(
        { error: 'Output file not found. Conversion may not be complete yet.' },
        { status: 404 }
      );
    }

    // Use the first MP4 file found
    const outputKey = mp4Files[0].Key!;
    console.log('✅ Using output file:', outputKey);

    // Derive download filename from the S3 key (MediaConvert preserves the original base name)
    // Key format: {fileId}/{originalBaseName}.mp4
    const keyFilename = outputKey.split('/').pop() || 'converted.mp4';
    const downloadFilename = keyFilename.endsWith('.mp4') ? keyFilename : `${keyFilename}.mp4`;

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
