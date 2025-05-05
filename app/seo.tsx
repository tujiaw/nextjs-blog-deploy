import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  keywords?: string
  canonical?: string
  publishedTime?: string
  modifiedTime?: string
  authors?: { name: string }[]
  locale?: string
  [key: string]: any
}

export function genPageMetadata({ 
  title, 
  description, 
  image, 
  keywords = siteMetadata.keywords,
  canonical,
  publishedTime,
  modifiedTime,
  authors = [{ name: siteMetadata.author }],
  locale = siteMetadata.locale,
  ...rest 
}: PageSEOProps): Metadata {
  return {
    title,
    description: description || siteMetadata.description,
    keywords: keywords,
    authors: authors,
    creator: siteMetadata.author,
    publisher: siteMetadata.title,
    alternates: {
      canonical: canonical || './',
      languages: {
        'zh-CN': `${siteMetadata.siteUrl}/zh/`,
        'en-US': `${siteMetadata.siteUrl}/en/`,
      },
    },
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: canonical || './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: locale,
      type: 'article',
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: authors?.map(author => author.name) || [siteMetadata.author],
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
      description: description || siteMetadata.description,
    },
    ...rest,
  }
}
