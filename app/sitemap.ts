import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

  // 主要页面优先级更高
  const routes = [
    {
      url: `${siteUrl}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'daily', 
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tags`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  return [...routes, ...blogRoutes]
}
