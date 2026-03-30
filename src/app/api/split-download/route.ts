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

    // List all files under this fileId prefix in the output bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: OUTPUT_BUCKET,
      Prefix: `${fileId}/`,
    });

    const listResponse = await s3Client.send(listCommand);

    const mp4Files = (listResponse.Contents ?? [])
      .filter((obj) => obj.Key?.endsWith('.mp4'))
      .sort((a, b) => {
        // Sort by _part number so parts come back in order
        const aNum = parseInt(a.Key?.match(/_part(\d+)/)?.[1] ?? '0', 10);
        const bNum = parseInt(b.Key?.match(/_part(\d+)/)?.[1] ?? '0', 10);
        return aNum - bNum;
      });

    if (mp4Files.length === 0) {
      return NextResponse.json(
        { error: 'No output files found. Conversion may not be complete yet.' },
        { status: 404 }
      );
    }

    // Generate a presigned download URL for each part
    const parts = await Promise.all(
      mp4Files.map(async (obj, index) => {
        const key = obj.Key!;
        const partMatch = key.match(/_part(\d+)/);
        const partNumber = partMatch ? parseInt(partMatch[1], 10) : index + 1;
        const filename = `part${partNumber}-converted.mp4`;

        const command = new GetObjectCommand({
          Bucket: OUTPUT_BUCKET,
          Key: key,
          ResponseContentDisposition: `attachment; filename="${filename}"`,
          ResponseContentType: 'video/mp4',
        });

        const downloadUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });

        return { partNumber, filename, downloadUrl };
      })
    );

    return NextResponse.json({ parts });
  } catch (error) {
    console.error('Split download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URLs' },
      { status: 500 }
    );
  }
}
