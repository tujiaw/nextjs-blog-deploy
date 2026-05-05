import { NextResponse } from 'next/server'
import tagData from 'app/tag-data.json'

export const dynamic = 'force-dynamic'

export async function GET() {
  const counts = tagData as Record<string, number>
  const tags = Object.keys(counts).sort((a, b) => a.localeCompare(b, 'zh-CN'))
  return NextResponse.json({ tags })
}
