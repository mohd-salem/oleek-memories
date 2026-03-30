import type { Metadata } from 'next'
import SplitVideoPage from '@/components/convert/SplitVideoPage'

export const metadata: Metadata = {
  title: 'Split Large Videos | OLEEK Memories Book',
  description: 'Split videos over 5 GB into device-ready parts (up to 4.5 GB each). Powered by AWS cloud processing — no software to install.',
}

export default function SplitPage() {
  return <SplitVideoPage />
}
