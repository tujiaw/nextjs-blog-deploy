import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import Script from 'next/script'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  publisher: siteMetadata.title,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: siteMetadata.locale,
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
    languages: {
      'zh-CN': `${siteMetadata.siteUrl}/`,
      'en-US': `${siteMetadata.siteUrl}/en/`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
    description: siteMetadata.description,
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
  category: 'technology',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="baidu-site-verification" content="codeva-EHH3T2jUu2" />
        <meta name="sogou_site_verification" content="F8HUpVCecD" />
        <meta name="360-site-verification" content="0cd3e18aac31c87a9b46ab55fdb8841e" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="google-site-verification" content="TXBeCdq8cjW-fzw7tzZ2p39Xmkgcm_24qIQhbYKEsVw" />
        <meta name="application-name" content={siteMetadata.title} />
      </head>
      <Script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4311958594666995"
        crossOrigin="anonymous"
      />
      
      {/* Dify Chatbot Configuration */}
      <Script id="dify-config">
        {`
          window.difyChatbotConfig = {
            token: 'y36BrO837K4wOZx3',
            systemVariables: {
              // user_id: 'YOU CAN DEFINE USER ID HERE',
              // conversation_id: 'YOU CAN DEFINE CONVERSATION ID HERE, IT MUST BE A VALID UUID',
            },
            userVariables: {
              // avatar_url: 'YOU CAN DEFINE USER AVATAR URL HERE',
              // name: 'YOU CAN DEFINE USER NAME HERE',
            },
          }
        `}
      </Script>
      
      {/* Dify Chatbot Embed Script */}
      <Script
        src="https://udify.app/embed.min.js"
        id="y36BrO837K4wOZx3"
        defer
      />
      
      {/* Dify Chatbot Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          #dify-chatbot-bubble-button {
            background-color: #1C64F2 !important;
          }
          #dify-chatbot-bubble-window {
            width: 24rem !important;
            height: 40rem !important;
          }
        `
      }} />
      
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="mb-auto">{children}</main>
            </SearchProvider>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
        <Script id="schema-org" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'url': siteMetadata.siteUrl,
            'name': siteMetadata.title,
            'description': siteMetadata.description,
            'author': {
              '@type': 'Person',
              'name': siteMetadata.author
            },
            'publisher': {
              '@type': 'Organization',
              'name': siteMetadata.title,
              'logo': {
                '@type': 'ImageObject',
                'url': `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`
              }
            },
            'potentialAction': {
              '@type': 'SearchAction',
              'target': `${siteMetadata.siteUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            },
            'sameAs': [
              siteMetadata.github,
              siteMetadata.x,
              siteMetadata.facebook,
              siteMetadata.youtube,
              siteMetadata.linkedin
            ]
          })}
        </Script>
      </body>
    </html>
  )
}
