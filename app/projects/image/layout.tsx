import { genPageMetadata } from '../../../app/seo'

export const metadata = genPageMetadata({ title: 'Image Generation' })

export default function ImageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 