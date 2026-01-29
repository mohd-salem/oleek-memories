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
    const updatedJobInfo = {
      ...jobInfo,
      status: status as any,
      progress,
      completedAt: status === 'COMPLETE' ? Date.now() : undefined,
      error: job.ErrorMessage,
    };
    jobStore.set(fileId, updatedJobInfo);

    // Send email notification if conversion is complete and email provided
    if (status === 'COMPLETE' && jobInfo.email && !jobInfo.emailSent) {
      console.log('🔔 Attempting to send email notification to:', jobInfo.email);
      try {
        // Get download URL
        const downloadResponse = await fetch(
          `${request.nextUrl.origin}/api/download?fileId=${fileId}`
        );
        if (downloadResponse.ok) {
          const { downloadUrl, filename } = await downloadResponse.json();
          
          console.log('📧 Sending email notification...', {
            email: jobInfo.email,
            filename,
            downloadUrlLength: downloadUrl?.length,
          });
          
          // Send email notification
          const notifyResponse = await fetch(`${request.nextUrl.origin}/api/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: jobInfo.email,
              fileId,
              downloadUrl,
              filename,
            }),
          });

          if (notifyResponse.ok) {
            console.log('✅ Email notification sent successfully');
            // Mark email as sent
            jobStore.set(fileId, { ...updatedJobInfo, emailSent: true });
          } else {
            const errorData = await notifyResponse.json();
            console.error('❌ Failed to send email notification:', errorData);
          }
        } else {
          console.error('❌ Failed to get download URL for email');
        }
      } catch (emailError) {
        console.error('❌ Email notification error:', emailError);
        // Don't fail the status check if email fails
      }
    } else if (status === 'COMPLETE' && !jobInfo.email) {
      console.log('ℹ️ Conversion complete but no email provided');
    } else if (status === 'COMPLETE' && jobInfo.emailSent) {
      console.log('ℹ️ Email already sent for this conversion');
    }

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
