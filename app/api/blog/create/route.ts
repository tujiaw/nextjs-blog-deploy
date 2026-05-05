import { NextResponse } from 'next/server'
import siteMetadata from '@/data/siteMetadata'
import { buildNewPostMdx, fileTimestampFrom } from '@/lib/format-new-post-mdx'

export const runtime = 'nodejs'

function parseRepoFromSite(): { owner: string; repo: string } | null {
  const overrideOwner = process.env.GITHUB_BLOG_OWNER
  const overrideRepo = process.env.GITHUB_BLOG_REPO
  if (overrideOwner && overrideRepo) {
    return { owner: overrideOwner, repo: overrideRepo }
  }
  try {
    const u = new URL(siteMetadata.siteRepo)
    if (u.hostname !== 'github.com') {
      return null
    }
    const parts = u.pathname
      .replace(/^\//, '')
      .replace(/\.git$/, '')
      .split('/')
      .filter(Boolean)
    if (parts.length < 2) {
      return null
    }
    return { owner: parts[0], repo: parts[1] }
  } catch {
    return null
  }
}

function readGithubToken(request: Request): string | null {
  const fromHeader = request.headers.get('x-github-blog-write-token')?.trim()
  if (fromHeader) {
    return fromHeader
  }
  const auth = request.headers.get('authorization')
  if (auth?.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim()
  }
  return null
}

type CreateBody = {
  title?: string
  tags?: string[]
  body?: string
}

export async function POST(request: Request) {
  const token = readGithubToken(request)
  if (!token) {
    return NextResponse.json(
      { error: '请提供 GitHub 个人访问令牌（请求头 x-github-blog-write-token）' },
      { status: 400 }
    )
  }

  const repoInfo = parseRepoFromSite()
  if (!repoInfo) {
    return NextResponse.json({ error: '无法从 siteMetadata.siteRepo 解析 GitHub 仓库' }, { status: 500 })
  }

  let json: CreateBody
  try {
    json = (await request.json()) as CreateBody
  } catch {
    return NextResponse.json({ error: '请求体不是合法 JSON' }, { status: 400 })
  }

  const title = typeof json.title === 'string' ? json.title.trim() : ''
  const body = typeof json.body === 'string' ? json.body : ''
  const tags = Array.isArray(json.tags)
    ? json.tags.filter((t): t is string => typeof t === 'string').map((t) => t.trim()).filter(Boolean)
    : []

  if (!title) {
    return NextResponse.json({ error: '请填写主题' }, { status: 400 })
  }
  if (!body.trim()) {
    return NextResponse.json({ error: '请填写正文' }, { status: 400 })
  }

  const now = new Date()
  const year = now.getFullYear()
  const ts = fileTimestampFrom(now)
  const path = `data/blog/${year}/${ts}.mdx`

  const dateStr = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const content = buildNewPostMdx({ title, date: dateStr, tags, body })
  const branch = process.env.GITHUB_BLOG_BRANCH || 'main'
  const encoded = Buffer.from(content, 'utf8').toString('base64')

  const encodedPath = path.split('/').map(encodeURIComponent).join('/')
  const url = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${encodedPath}`

  const ghRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      message: `chore(blog): add post ${ts}`,
      content: encoded,
      branch,
    }),
  })

  const ghJson = (await ghRes.json().catch(() => ({}))) as { message?: string; content?: { path?: string } }

  if (!ghRes.ok) {
    return NextResponse.json(
      { error: ghJson.message || `GitHub API 错误 (${ghRes.status})` },
      { status: ghRes.status >= 400 && ghRes.status < 600 ? ghRes.status : 502 }
    )
  }

  return NextResponse.json({
    ok: true,
    path: ghJson.content?.path ?? path,
    branch,
  })
}
