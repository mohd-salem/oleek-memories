import { NextRequest, NextResponse } from 'next/server';
import { CreateJobCommand } from '@aws-sdk/client-mediaconvert';
import { getMediaConvertClient, MEDIACONVERT_ROLE_ARN } from '@/lib/aws/mediaconvert-client';
import { INPUT_BUCKET, OUTPUT_BUCKET } from '@/lib/aws/s3-client';

interface Segment {
  partNumber: number;
  startTime: number; // seconds
  endTime?: number;  // seconds, undefined means end of video
}

/**
 * Converts seconds to MediaConvert timecode format HH:MM:SS:FF
 * Uses 30fps as default (matches OLEEK device playback)
 */
function secondsToTimecode(totalSeconds: number, fps = 30): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const f = Math.round((totalSeconds % 1) * fps);
  return [h, m, s, f].map((n) => String(n).padStart(2, '0')).join(':');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, inputKey, segments, email } = body as {
      fileId: string;
      inputKey: string;
      segments: Segment[];
      email?: string;
    };

    if (!fileId || !inputKey || !Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: fileId, inputKey, segments' },
        { status: 400 }
      );
    }

    if (segments.length > 20) {
      return NextResponse.json(
        { error: 'Maximum 20 split parts supported' },
        { status: 400 }
      );
    }

    const mediaConvertClient = await getMediaConvertClient();
    const originalFilename = inputKey.split('/').pop() || 'video.mp4';

    const jobIds: string[] = [];
    const totalParts = segments.length;

    for (const segment of segments) {
      const inputClippings = [
        {
          StartTimecode: secondsToTimecode(segment.startTime),
          ...(segment.endTime !== undefined
            ? { EndTimecode: secondsToTimecode(segment.endTime) }
            : {}),
        },
      ];

      const command = new CreateJobCommand({
        Role: MEDIACONVERT_ROLE_ARN,
        Queue: process.env.AWS_MEDIACONVERT_QUEUE,
        UserMetadata: {
          fileId,
          email: email || '',
          originalFilename,
          splitJob: 'true',
          partNumber: String(segment.partNumber),
          totalParts: String(totalParts),
        },
        Settings: {
          Inputs: [
            {
              FileInput: `s3://${INPUT_BUCKET}/${inputKey}`,
              InputClippings: inputClippings,
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
                  NameModifier: `_part${segment.partNumber}`,
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
                        MaxBitrate: 5000000,
                        RateControlMode: 'QVBR',
                        QvbrSettings: {
                          QvbrQualityLevel: 7,
                        },
                        QualityTuningLevel: 'SINGLE_PASS',
                        CodecProfile: 'MAIN',
                        CodecLevel: 'AUTO',
                        GopSize: 60,
                        GopSizeUnits: 'FRAMES',
                        FramerateControl: 'INITIALIZE_FROM_SOURCE',
                      },
                    },
                    Width: 1920,
                    Height: 1080,
                    RespondToAfd: 'NONE',
                    ScalingBehavior: 'FIT',
                    AntiAlias: 'ENABLED',
                  },
                  AudioDescriptions: [
                    {
                      AudioSourceName: 'Audio Selector 1',
                      CodecSettings: {
                        Codec: 'AAC',
                        AacSettings: {
                          Bitrate: 192000,
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

      if (!response.Job?.Id) {
        throw new Error(`Failed to create job for part ${segment.partNumber}`);
      }

      jobIds.push(response.Job.Id);
    }

    return NextResponse.json({ jobIds, fileId, totalParts });
  } catch (error) {
    console.error('Split API error:', error);
    return NextResponse.json(
      { error: 'Failed to create split jobs' },
      { status: 500 }
    );
  }
}
