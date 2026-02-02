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

    // Send email notification if conversion is complete and email provided
    if (status === 'COMPLETE' && metadataEmail && !emailSent && metadataFileId) {
      console.log('🔔 Attempting to send email notification to:', metadataEmail);
      try {
        // Get download URL
        const downloadResponse = await fetch(
          `${request.nextUrl.origin}/api/download?fileId=${metadataFileId}`
        );
        if (downloadResponse.ok) {
          const { downloadUrl, filename } = await downloadResponse.json();
          
          console.log('📧 Sending email notification...', {
            email: metadataEmail,
            filename,
            downloadUrlLength: downloadUrl?.length,
          });
          
          // Send email notification
          const notifyResponse = await fetch(`${request.nextUrl.origin}/api/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: metadataEmail,
              fileId: metadataFileId,
              downloadUrl,
              filename,
            }),
          });

          if (notifyResponse.ok) {
            console.log('✅ Email notification sent successfully');
            // Mark email as sent in job store
            const currentInfo = jobStore.get(metadataFileId);
            if (currentInfo) {
              jobStore.set(metadataFileId, { ...currentInfo, emailSent: true });
            }
          } else {
            const errorData = await notifyResponse.json();
            console.error('❌ Failed to send email notification:', errorData);
          }
        } else {
          const errorText = await downloadResponse.text();
          console.error('❌ Failed to get download URL for email:', {
            status: downloadResponse.status,
            fileId: metadataFileId,
            error: errorText,
          });
        }
      } catch (emailError) {
        console.error('❌ Email notification error:', emailError);
        // Don't fail the status check if email fails
      }
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
