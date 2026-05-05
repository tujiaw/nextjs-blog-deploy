'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from '@/components/Link'

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25 dark:border-gray-600 dark:bg-gray-900/60 dark:text-gray-100'
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-800 dark:text-gray-200'

export default function BlogWritePage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tagQuery, setTagQuery] = useState('')
  const [extraTags, setExtraTags] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [allTags, setAllTags] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loadingTags, setLoadingTags] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const loadTags = useCallback(async () => {
    setLoadingTags(true)
    try {
      const res = await fetch('/api/blog/tags')
      const data = (await res.json()) as { tags?: string[] }
      setAllTags(Array.isArray(data.tags) ? data.tags : [])
    } catch {
      setAllTags([])
    } finally {
      setLoadingTags(false)
    }
  }, [])

  useEffect(() => {
    void loadTags()
  }, [loadTags])

  const filteredTags = useMemo(() => {
    const q = tagQuery.trim().toLowerCase()
    if (!q) {
      return allTags
    }
    return allTags.filter((t) => t.toLowerCase().includes(q))
  }, [allTags, tagQuery])

  const toggleTag = (t: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(t)) {
        next.delete(t)
      } else {
        next.add(t)
      }
      return next
    })
  }

  const mergedTags = useMemo(() => {
    const fromExtra = extraTags
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean)
    const ordered: string[] = []
    const seen = new Set<string>()
    for (const t of [...selected, ...fromExtra]) {
      if (!seen.has(t)) {
        seen.add(t)
        ordered.push(t)
      }
    }
    return ordered
  }, [selected, extraTags])

  const clearInputs = () => {
    setTitle('')
    setBody('')
    setTagQuery('')
    setExtraTags('')
    setSelected(new Set())
    setGithubToken('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    const token = githubToken.trim()
    if (!token) {
      setMessage({ type: 'err', text: '请填写 GITHUB_BLOG_WRITE_TOKEN（GitHub 个人访问令牌）' })
      setSubmitting(false)
      return
    }
    try {
      const res = await fetch('/api/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-github-blog-write-token': token,
        },
        body: JSON.stringify({
          title: title.trim(),
          tags: mergedTags,
          body,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; path?: string }
      if (!res.ok) {
        setMessage({ type: 'err', text: data.error || `提交失败 (${res.status})` })
        return
      }
      setMessage({ type: 'ok', text: `已创建：${data.path ?? ''}。仓库更新并重新部署后即可在站点看到文章。` })
      clearInputs()
    } catch {
      setMessage({ type: 'err', text: '网络错误，请稍后重试' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">写文章</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <div>
            <label htmlFor="write-title" className={labelClass}>
              主题
            </label>
            <input
              id="write-title"
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              className={inputClass}
              placeholder="文章标题"
              required
            />
          </div>

          <section className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 dark:border-gray-700 dark:bg-gray-900/40">
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">标签</h2>
            <label htmlFor="write-tag-search" className="sr-only">
              筛选标签
            </label>
            <input
              id="write-tag-search"
              type="search"
              value={tagQuery}
              onChange={(ev) => setTagQuery(ev.target.value)}
              placeholder="搜索已有标签…"
              className={`${inputClass} mb-3 text-sm`}
            />
            <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-950/50">
              {loadingTags ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">加载中…</p>
              ) : filteredTags.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">无匹配标签</p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {filteredTags.map((t) => (
                    <li key={t}>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-sm shadow-sm transition-colors hover:border-primary-300 dark:border-gray-600 dark:bg-gray-900 dark:hover:border-primary-600">
                        <input
                          type="checkbox"
                          checked={selected.has(t)}
                          onChange={() => toggleTag(t)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
                        />
                        <span className="text-gray-800 dark:text-gray-200">{t}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <label htmlFor="write-extra-tags" className={`${labelClass} mt-4`}>
              其他标签（逗号分隔，可选）
            </label>
            <input
              id="write-extra-tags"
              type="text"
              value={extraTags}
              onChange={(ev) => setExtraTags(ev.target.value)}
              className={`${inputClass} text-sm`}
              placeholder="例如：笔记, 随笔"
            />
            {mergedTags.length > 0 ? (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">将写入：{mergedTags.join('、')}</p>
            ) : null}
          </section>

          <div>
            <label htmlFor="write-body" className={labelClass}>
              Markdown 正文
            </label>
            <textarea
              id="write-body"
              value={body}
              onChange={(ev) => setBody(ev.target.value)}
              required
              spellCheck={false}
              className={`${inputClass} min-h-[20rem] resize-y font-mono text-sm leading-relaxed sm:min-h-[26rem]`}
              placeholder="支持 Markdown / MDX；小于号、大于号两侧请加空格，HTML 请使用自闭合标签。"
            />
          </div>

          <section className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 dark:border-gray-700 dark:bg-gray-900/40">
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">GitHub 凭证</h2>
            <label htmlFor="write-github-token" className={labelClass}>
              GITHUB_BLOG_WRITE_TOKEN
            </label>
            <input
              id="write-github-token"
              type="password"
              value={githubToken}
              onChange={(ev) => setGithubToken(ev.target.value)}
              autoComplete="off"
              className={inputClass}
              placeholder="需具备该仓库 Contents 写入权限的 PAT"
              required
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              仅用于本次请求，不会保存在服务器；请勿在公共设备上留存。
            </p>
          </section>

          {message ? (
            <div
              role="status"
              className={
                message.type === 'ok'
                  ? 'rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-200'
                  : 'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200'
              }
            >
              {message.text}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/blog"
            className="inline-flex justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800/80"
          >
            返回博客列表
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => {
                clearInputs()
                setMessage(null)
              }}
              className="inline-flex justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800/80"
            >
              清空表单
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              {submitting ? '提交中…' : '提交到 GitHub'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
