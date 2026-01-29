import { NextRequest, NextResponse } from 'next/server';
import { CreateJobCommand } from '@aws-sdk/client-mediaconvert';
import { getMediaConvertClient, MEDIACONVERT_ROLE_ARN } from '@/lib/aws/mediaconvert-client';
import { INPUT_BUCKET, OUTPUT_BUCKET } from '@/lib/aws/s3-client';
import { jobStore } from '@/lib/aws/job-store';

export async function POST(request: NextRequest) {
  try {
    const { fileId, inputKey, email } = await request.json();

    if (!fileId || !inputKey) {
      return NextResponse.json(
        { error: 'Missing fileId or inputKey' },
        { status: 400 }
      );
    }

    const outputKey = `${fileId}/output.mp4`;

    // Get MediaConvert client with correct endpoint
    const mediaConvertClient = await getMediaConvertClient();

    // Create MediaConvert job with OLEEK specs
    const command = new CreateJobCommand({
      Role: MEDIACONVERT_ROLE_ARN,
      Settings: {
        Inputs: [
          {
            FileInput: `s3://${INPUT_BUCKET}/${inputKey}`,
            AudioSelectors: {
              'Audio Selector 1': {
                DefaultSelection: 'DEFAULT',
              },
            },
            VideoSelector: {},
          },
        ],
        OutputGroups: [
          {
            Name: 'File Group',
            OutputGroupSettings: {
              Type: 'FILE_GROUP_SETTINGS',
              FileGroupSettings: {
                Destination: `s3://${OUTPUT_BUCKET}/${fileId}/`,
              },
            },
            Outputs: [
              {
                NameModifier: 'output', // This will create output.mp4
                ContainerSettings: {
                  Container: 'MP4',
                  Mp4Settings: {
                    CslgAtom: 'INCLUDE',
                    FreeSpaceBox: 'EXCLUDE',
                    MoovPlacement: 'PROGRESSIVE_DOWNLOAD',
                  },
                },
                VideoDescription: {
                  CodecSettings: {
                    Codec: 'H_264',
                    H264Settings: {
                      MaxBitrate: 5000000, // 5 Mbps max (QVBR mode uses MaxBitrate only)
                      RateControlMode: 'QVBR',
                      QvbrSettings: {
                        QvbrQualityLevel: 8, // Quality level 1-10 (8 = high quality)
                      },
                      QualityTuningLevel: 'SINGLE_PASS',
                      CodecProfile: 'MAIN',
                      CodecLevel: 'AUTO',
                      GopSize: 60,
                      GopSizeUnits: 'FRAMES',
                      FramerateControl: 'SPECIFIED',
                      FramerateNumerator: 30,
                      FramerateDenominator: 1,
                    },
                  },
                  Width: 1920,
                  Height: 1080,
                  RespondToAfd: 'NONE',
                  ScalingBehavior: 'DEFAULT',
                  AntiAlias: 'ENABLED',
                },
                AudioDescriptions: [
                  {
                    AudioSourceName: 'Audio Selector 1',
                    CodecSettings: {
                      Codec: 'AAC',
                      AacSettings: {
                        Bitrate: 192000, // 192 kbps
                        CodingMode: 'CODING_MODE_2_0',
                        SampleRate: 48000,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    const response = await mediaConvertClient.send(command);
    const jobId = response.Job?.Id;

    if (!jobId) {
      throw new Error('No job ID returned from MediaConvert');
    }

    // Store job info
    const jobInfo = {
      jobId,
      fileId,
      inputKey,
      outputKey: `${fileId}/output.mp4`,
      status: 'SUBMITTED' as const,
      createdAt: Date.now(),
      email: email || undefined,
      emailSent: false,
    };
    jobStore.set(fileId, jobInfo);

    return NextResponse.json({
      success: true,
      jobId,
      fileId,
    });
  } catch (error) {
    console.error('Error creating MediaConvert job:', error);
    return NextResponse.json(
      { error: 'Failed to start conversion' },
      { status: 500 }
    );
  }
}
