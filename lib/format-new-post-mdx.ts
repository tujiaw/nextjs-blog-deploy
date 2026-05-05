/** YAML 单引号字符串转义（与项目 MDX 约定一致） */
export function yamlSingleQuoted(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function excerptFromMarkdown(raw: string, maxLen: number): string {
  const stripped = raw
    .replace(/^#[^\n]*\n/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (stripped.length <= maxLen) {
    return stripped
  }
  return `${stripped.slice(0, maxLen - 1)}…`
}

export function buildNewPostMdx(input: {
  title: string
  date: string
  tags: string[]
  body: string
}): string {
  const summary = excerptFromMarkdown(input.body, 200) || input.title
  const tagsJson = JSON.stringify(input.tags)
  const frontmatter = `---
title: ${yamlSingleQuoted(input.title)}
date: ${input.date}
tags: ${tagsJson}
summary: ${yamlSingleQuoted(summary)}
draft: false
---

`
  return `${frontmatter}${input.body.replace(/^\uFEFF/, '')}`
}

export function fileTimestampFrom(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  )
}
