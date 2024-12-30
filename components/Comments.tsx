'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import Giscus from '@giscus/react'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return null
  }
  return (
    <Giscus
      id="comments"
      repo="tujiaw/giscus"
      repoId="R_kgDOLXn1xw"
      category="Announcements"
      categoryId="DIC_kwDOLXn1x84Cdfzo"
      mapping="pathname"
      term="Welcome to @giscus/react component!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="zh-CN"
      loading="lazy"
    />
  )
}
