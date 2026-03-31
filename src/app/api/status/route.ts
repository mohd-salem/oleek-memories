import { NextRequest, NextResponse } from 'next/server';
import { GetJobCommand } from '@aws-sdk/client-mediaconvert';
import { getMediaConvertClient } from '@/lib/aws/mediaconvert-client';
import { jobStore } from '@/lib/aws/job-store';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('fileId');
    const jobId = searchParams.get('jobId');

    // Support both fileId (legacy) and jobId (new approach)
    if (!fileId && !jobId) {
      return NextResponse.json(
        { error: 'Missing fileId or jobId parameter' },
        { status: 400 }
      );
    }

    // Get MediaConvert client with correct endpoint
    const mediaConvertClient = await getMediaConvertClient();

    // Try to get job info from store first (for backward compatibility)
    let actualJobId = jobId;
    let actualFileId = fileId;
    let storedEmail: string | undefined;
    let emailSent = false;

    if (fileId) {
      const jobInfo = jobStore.get(fileId);
      if (jobInfo) {
        actualJobId = jobInfo.jobId;
        storedEmail = jobInfo.email;
        emailSent = jobInfo.emailSent || false;
      }
    }

    if (!actualJobId) {
      return NextResponse.json(
        { error: 'Job not found - please refresh and try converting again' },
        { status: 404 }
      );
    }

    // Query MediaConvert for current status
    const command = new GetJobCommand({ Id: actualJobId });
    const response = await mediaConvertClient.send(command);

    const job = response.Job;
    if (!job) {
      return NextResponse.json(
        { error: 'Job data not available' },
        { status: 500 }
      );
    }

    // Get fileId and email from job metadata
    const metadataFileId = job.UserMetadata?.fileId || actualFileId;
    const metadataEmail = job.UserMetadata?.email || storedEmail;

    const status = job.Status!;
    const progress = job.JobPercentComplete || 0;

    // Update job store if we have fileId (for email tracking)
    if (metadataFileId) {
      const updatedJobInfo = {
        jobId: actualJobId,
        fileId: metadataFileId,
        inputKey: '', // Not needed for status check
        outputKey: `${metadataFileId}/output.mp4`,
        status: status as any,
        progress,
        createdAt: Date.now(),
        completedAt: status === 'COMPLETE' ? Date.now() : undefined,
        error: job.ErrorMessage,
        email: metadataEmail,
        emailSent,
      };
      jobStore.set(metadataFileId, updatedJobInfo);
    }

    return NextResponse.json({
      status,
      progress,
      error: job.ErrorMessage,
      outputKey: `${metadataFileId}/output.mp4`,
      fileId: metadataFileId,
      jobId: actualJobId,
    });
  } catch (error) {
    console.error('Error checking job status:', error);
    return NextResponse.json(
      { error: 'Failed to check conversion status' },
      { status: 500 }
    );
  }
}
