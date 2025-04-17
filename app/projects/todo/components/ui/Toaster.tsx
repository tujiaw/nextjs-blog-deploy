'use client'

import { useState, useEffect } from 'react'
import { useTodoStore } from '../../store/todoStore'

export function Toaster() {
  const [visible, setVisible] = useState(false)
  const { error } = useTodoStore()

  useEffect(() => {
    if (error) {
      setVisible(true)
      
      const timer = setTimeout(() => {
        setVisible(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [error])
  
  if (!error || !visible) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 transform rounded-lg bg-red-100 p-4 shadow-lg transition-all dark:bg-red-900">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-red-500 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-sm font-medium text-red-700 dark:text-red-200">{error}</p>
      </div>
    </div>
  )
} 