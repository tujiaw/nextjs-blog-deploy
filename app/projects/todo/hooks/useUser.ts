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
    
    // 获取网站URL，确保在Vercel和本地环境下都能正常工作
    let redirectUrl = `${window.location.origin}/projects/todo`    
    // 如果仍未设置重定向URL，使用备选方案
    if (!redirectUrl) {
      // 在NextJS应用中，可以硬编码生产环境URL，例如：
      // redirectUrl = 'https://your-app-domain.vercel.app/projects/todo'
      redirectUrl = `${window.location.href.split('?')[0]}`
      console.log('使用备选重定向URL:', redirectUrl)
    }
    
    console.log('最终使用的重定向URL:', redirectUrl)
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