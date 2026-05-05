import { genPageMetadata } from 'app/seo'
import BlogWritePage from '@/components/BlogWritePage'

export const metadata = genPageMetadata({
  title: '写文章',
  description: '新建博客文章并提交到 GitHub 仓库',
})

export default function Page() {
  return <BlogWritePage />
}
