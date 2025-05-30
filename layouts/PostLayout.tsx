'use client'

import { ReactNode, useState, useEffect } from 'react'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/TableOfContents'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, toc } = content
  const basePath = path.split('/')[0]
  const [isTocVisible, setIsTocVisible] = useState(true)
  
  // 监听目录组件的可见性状态
  useEffect(() => {
    const tocElement = document.querySelector('[data-toc-container]')
    if (!tocElement) return
    
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          const element = mutation.target as HTMLElement
          const isNarrow = element.classList.contains('w-8')
          setIsTocVisible(!isNarrow)
        }
      }
    })
    
    observer.observe(tocElement, { attributes: true })
    
    return () => observer.disconnect()
  }, [])

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <div>
                <h1 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-4xl md:leading-13">
                  {title}
                </h1>
              </div>
              <div className="flex flex-row items-center justify-center gap-4 pt-1">
                <div className="flex flex-wrap justify-center gap-2">
                  {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                </div>
                <div className="text-lg font-bold text-gray-500 dark:text-gray-400">•</div>
                <div>
                  <time
                    className="text-base font-medium text-gray-500 dark:text-gray-400"
                    dateTime={date}
                  >
                    {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                  </time>
                </div>
              </div>
            </div>
          </header>
          <div 
            className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:gap-x-6 xl:divide-y-0"
            style={{ 
              gridTemplateColumns: isTocVisible 
                ? 'minmax(0, 1fr) minmax(0, 3fr)' 
                : 'minmax(0, 0.1fr) minmax(0, 3.9fr)' 
            }}
          >
            <TableOfContents
              toc={toc}
              className="overflow-hidden pt-8 xl:sticky xl:top-[0rem] xl:max-h-[calc(100vh-8rem)] xl:pr-4 xl:pt-10"
              data-toc-container={true}
            />
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>

              {/* 导航页脚 */}
              <div className="border-t border-gray-200 py-6 dark:border-gray-700">
                <div className="flex flex-col py-4 md:flex-row md:justify-between">
                  <div className="mb-4 md:mb-0 md:w-1/2 md:pr-4">
                    {next?.path ? (
                      <div>
                        <h2 className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          上一篇文章
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    ) : (
                      <div className="h-10" />
                    )}
                  </div>

                  <div className="md:w-1/2 md:pl-4 md:text-right">
                    {prev?.path ? (
                      <div>
                        <h2 className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          下一篇文章
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    ) : (
                      <div className="h-10" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center border-t border-gray-200 py-4 dark:border-gray-700">
                  <div className="mt-4">
                    <Link
                      href={`/${basePath}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label="Back to the blog"
                    >
                      &larr; 返回博客列表
                    </Link>
                  </div>
                </div>
              </div>

              {siteMetadata.comments && (
                <div
                  className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
