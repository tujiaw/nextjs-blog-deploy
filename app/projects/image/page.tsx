'use client'

import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import ChatHistory from './components/ChatHistory'
import InputArea from './components/InputArea'
import FullImageModal from './components/FullImageModal'

const modelOptions = ['Kwai-Kolors/Kolors']
const imageSizeOptions = ['1024x1024', '960x1280', '768x1024', '720x1440', '720x1280']

export default function ImageGeneration() {
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [imageHistory, setImageHistory] = useState<{url: string, size: string}[]>([])
  const [showFullImage, setShowFullImage] = useState(false)
  const [fullImageUrl, setFullImageUrl] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const [formData, setFormData] = useState({
    model: 'Kwai-Kolors/Kolors',
    prompt: '',
    negative_prompt: '',
    image_size: '1024x1024',
    batch_size: 1,
    seed: Math.floor(Math.random() * 9999999999),
    num_inference_steps: 20,
    guidance_scale: 7.5,
  })

  // Focus on textarea when the page loads
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Scroll to bottom when new image is added
  useEffect(() => {
    if (chatContainerRef.current && imageHistory.length > 0) {
      setTimeout(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight
      }, 100) // Small delay to ensure image is rendered
    }
  }, [imageHistory])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.prompt.trim() === '') return
    
    // If already loading, this means we want to cancel
    if (loading) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal
      
      // Generate a random seed for each submission
      const dataToSend = {
        ...formData,
        seed: Math.floor(Math.random() * 9999999999)
      };
      
      const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
        signal: signal
      })
      const data = await response.json()
      if (data.images && data.images[0]) {
        const newImage = data.images[0].url
        setGeneratedImage(newImage)
        // Add to history (at the end, so newest is at the bottom)
        setImageHistory(prev => [
          ...prev,
          { url: newImage, size: formData.image_size }
        ])
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Image generation cancelled')
      } else {
        console.error('Error generating image:', error)
      }
    } finally {
      if (abortControllerRef.current) {
        abortControllerRef.current = null
      }
      setLoading(false)
      // Clear the prompt
      setFormData(prev => ({ ...prev, prompt: '' }))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit form on Enter key (without Shift key)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batch_size' || name === 'num_inference_steps' 
        ? parseInt(value) 
        : name === 'guidance_scale' 
          ? parseFloat(value)
          : value
    }))
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const clearHistory = () => {
    setImageHistory([])
    setGeneratedImage('')
  }

  const viewOriginalImage = (url: string) => {
    setFullImageUrl(url)
    setShowFullImage(true)
  }

  const closeFullImage = () => {
    setShowFullImage(false)
  }

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 h-[480px] rounded-lg shadow-md mx-auto my-4 overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Sidebar Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-2 left-2 z-50 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 9l3 3-3 3M6.75 12h7.5" />
          )}
        </svg>
      </button>

      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        modelOptions={modelOptions}
        imageSizeOptions={imageSizeOptions}
      />

      {/* Right Column - Chat Interface */}
      <div className={`transition-all duration-300 ease-in-out flex-1 flex flex-col ${sidebarOpen ? 'ml-0' : 'ml-0'} max-w-full h-full`}>
        <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI Image Generator</h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs">Generate AI images through conversation</p>
          </div>
          {imageHistory.length > 0 && (
            <button 
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Clear History
            </button>
          )}
        </div>

        {/* Chat History Component */}
        <ChatHistory 
          chatContainerRef={chatContainerRef}
          imageHistory={imageHistory}
          viewOriginalImage={viewOriginalImage}
        />

        {/* Input Area Component */}
        <InputArea 
          textareaRef={textareaRef}
          formData={formData}
          loading={loading}
          handleInputChange={handleInputChange}
          handleKeyDown={handleKeyDown}
          handleSubmit={handleSubmit}
        />
      </div>

      {/* Full Image Modal Component */}
      <FullImageModal 
        showFullImage={showFullImage}
        fullImageUrl={fullImageUrl}
        closeFullImage={closeFullImage}
      />
    </div>
  )
} 