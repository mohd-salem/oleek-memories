import type { Metadata } from 'next'
import ConvertPageAWS from '@/components/convert/ConvertPageAWS'

export const metadata: Metadata = {
  title: 'Free Video Converter | OLEEK Memories Book',
  description: 'Fast, professional video conversion powered by AWS. Convert videos to OLEEK memory book format in seconds with H.264, 1080p, 30fps encoding.',
}

export default function ConvertPage() {
  return <ConvertPageAWS />
}
