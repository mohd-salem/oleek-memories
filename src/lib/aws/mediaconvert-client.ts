import { MediaConvertClient, DescribeEndpointsCommand } from '@aws-sdk/client-mediaconvert';

let cachedEndpoint: string | null = null;
let mediaConvertClientInstance: MediaConvertClient | null = null;

export async function getMediaConvertClient(): Promise<MediaConvertClient> {
  if (mediaConvertClientInstance) {
    return mediaConvertClientInstance;
  }

  // First, create a temporary client to get the endpoint
  const tempClient = new MediaConvertClient({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  if (!cachedEndpoint) {
    const command = new DescribeEndpointsCommand({});
    const response = await tempClient.send(command);
    cachedEndpoint = response.Endpoints?.[0]?.Url ?? null;
    
    if (!cachedEndpoint) {
      throw new Error('Failed to retrieve MediaConvert endpoint');
    }
  }

  // Now create the actual client with the correct endpoint
  mediaConvertClientInstance = new MediaConvertClient({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    endpoint: cachedEndpoint,
  });

  return mediaConvertClientInstance;
}

export const MEDIACONVERT_ROLE_ARN = process.env.AWS_MEDIACONVERT_ROLE_ARN!;
