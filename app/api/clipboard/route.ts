import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

// 使用 service_role 密钥创建客户端，这样可以绕过 RLS 策略
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 生成1000-9999之间的随机数
function generateRandomCode(): number {
  return Math.floor(Math.random() * 9000) + 1000;
}

// 检查访问码是否已存在
async function isCodeExists(code: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('clipboard')
    .select('code')
    .eq('code', code)
    .limit(1);
  
  if (error) {
    console.error('Error checking code existence:', error);
    return false;
  }
  
  return data && data.length > 0;
}

// 生成唯一的访问码
async function generateUniqueCode(): Promise<number> {
  let code = generateRandomCode();
  let exists = await isCodeExists(code);
  
  // 尝试最多10次生成唯一码
  let attempts = 0;
  while (exists && attempts < 10) {
    code = generateRandomCode();
    exists = await isCodeExists(code);
    attempts++;
  }
  
  return code;
}

export async function GET(request: Request) {
  try {
    // 从URL中获取访问码
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'Access code is required' }, { status: 400 });
    }
    
    const codeNum = parseInt(code, 10);
    if (isNaN(codeNum) || codeNum < 1000 || codeNum > 9999) {
      return NextResponse.json({ error: 'Invalid access code' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('clipboard')
      .select('content')
      .eq('code', codeNum)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw error

    // 检查是否找到匹配的访问码
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Invalid access code or no content found' }, { status: 404 });
    }
    
    return NextResponse.json({ content: data[0].content })
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

    // 生成唯一的访问码
    const code = await generateUniqueCode();
    
    // 使用 service_role 密钥绕过 RLS 策略
    const { error } = await supabase
      .from('clipboard')
      .insert([{ content, code }])

    if (error) {
      console.error('Error saving clipboard content:', error)
      throw error
    }

    return NextResponse.json({ success: true, code })
  } catch (error) {
    console.error('Error saving clipboard content:', error)
    return NextResponse.json({ error: 'Failed to save clipboard content' }, { status: 500 })
  }
} 