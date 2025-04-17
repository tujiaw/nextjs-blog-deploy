'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    fetchUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async () => {
    setIsLoading(true)
    
    // 获取正确的重定向URL
    let redirectUrl = ''
    
    // 优先使用Vercel URL环境变量
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      redirectUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/projects/todo`
      console.log('使用VERCEL_URL重定向:', redirectUrl)
    } 
    // 否则使用当前窗口的origin
    else if (typeof window !== 'undefined') {
      redirectUrl = `${window.location.origin}/projects/todo`
      console.log('使用window.location.origin重定向:', redirectUrl)
    }
    
    // 确保在任何情况下都有重定向URL
    if (!redirectUrl && typeof window !== 'undefined') {
      redirectUrl = `${window.location.href.split('?')[0]}`
      console.log('使用当前URL作为备选重定向:', redirectUrl)
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
      },
    })
    
    if (error) {
      console.error('登录错误:', error)
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    setIsLoading(false)
  }

  return { user, isLoading, signIn, signOut }
} 