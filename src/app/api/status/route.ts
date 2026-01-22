import { NextRequest, NextResponse } from 'next/server';
import { GetJobCommand } from '@aws-sdk/client-mediaconvert';
import { getMediaConvertClient } from '@/lib/aws/mediaconvert-client';
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

    // Get MediaConvert client with correct endpoint
    const mediaConvertClient = await getMediaConvertClient();

    // Query MediaConvert for current status
    const command = new GetJobCommand({ Id: jobInfo.jobId });
    const response = await mediaConvertClient.send(command);

    const job = response.Job;
    if (!job) {
      return NextResponse.json(
        { error: 'Job data not available' },
        { status: 500 }
      );
    }

    const status = job.Status!;
    const progress = job.JobPercentComplete || 0;

    // Update job store
    jobStore.set(fileId, {
      ...jobInfo,
      status: status as any,
      progress,
      completedAt: status === 'COMPLETE' ? Date.now() : undefined,
      error: job.ErrorMessage,
    });

    return NextResponse.json({
      status,
      progress,
      error: job.ErrorMessage,
      outputKey: jobInfo.outputKey,
    });
  } catch (error) {
    console.error('Error checking job status:', error);
    return NextResponse.json(
      { error: 'Failed to check conversion status' },
      { status: 500 }
    );
  }
}
