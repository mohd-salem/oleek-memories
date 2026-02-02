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
        // Retry getting download URL with delay (S3 might need a moment after MediaConvert completes)
        let downloadUrl = null;
        let filename = null;
        
        for (let attempt = 1; attempt <= 3; attempt++) {
          const downloadResponse = await fetch(
            `${request.nextUrl.origin}/api/download?fileId=${metadataFileId}`
          );
          
          if (downloadResponse.ok) {
            const data = await downloadResponse.json();
            downloadUrl = data.downloadUrl;
            filename = data.filename;
            console.log(`✅ Got download URL on attempt ${attempt}`);
            break;
          } else if (attempt < 3) {
            console.log(`⏳ Download URL not ready, retrying (attempt ${attempt}/3)...`);
            // Wait 2 seconds before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            const errorText = await downloadResponse.text();
            console.error('❌ Failed to get download URL after 3 attempts:', {
              status: downloadResponse.status,
              fileId: metadataFileId,
              error: errorText,
            });
          }
        }
        
        if (!downloadUrl || !filename) {
          console.error('❌ Could not get download URL for email - will retry on next status poll');
          // Don't throw - let it retry on next poll
        } else {
          
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
