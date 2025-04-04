import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('clipboard')
      .select('content')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw error

    const content = data && data.length > 0 ? data[0].content : ''
    
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error fetching clipboard content:', error)
    return NextResponse.json({ error: 'Failed to fetch clipboard content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('clipboard')
      .insert([{ content }])

    if (error) {
      console.error('Error saving clipboard content:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving clipboard content:', error)
    return NextResponse.json({ error: 'Failed to save clipboard content' }, { status: 500 })
  }
} 