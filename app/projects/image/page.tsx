'use client'

import { useState, useEffect, useRef } from 'react'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.prompt.trim() === '') return
    
    setLoading(true)
    try {
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
      console.error('Error generating image:', error)
    } finally {
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

      {/* Left Column - Parameters */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0'} h-full overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm`}>
        <div className="p-3 space-y-3 h-full overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-6">Generation Parameters</h2>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 border border-gray-200 dark:border-gray-600">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Model</label>
              <select
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full text-xs rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              >
                {modelOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 border border-gray-200 dark:border-gray-600">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Image Size</label>
              <select
                name="image_size"
                value={formData.image_size}
                onChange={handleInputChange}
                className="w-full text-xs rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              >
                {imageSizeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 border border-gray-200 dark:border-gray-600">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Negative Prompt</label>
              <input
                type="text"
                name="negative_prompt"
                value={formData.negative_prompt}
                onChange={handleInputChange}
                className="w-full text-xs rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                placeholder="What to avoid..."
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 border border-gray-200 dark:border-gray-600">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Batch</label>
                <input
                  type="number"
                  name="batch_size"
                  value={formData.batch_size}
                  onChange={handleInputChange}
                  min="1"
                  max="4"
                  className="w-full text-xs rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 border border-gray-200 dark:border-gray-600">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Steps</label>
                <input
                  type="number"
                  name="num_inference_steps"
                  value={formData.num_inference_steps}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full text-xs rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 border border-gray-200 dark:border-gray-600">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Guidance Scale (0-20)</label>
              <input
                type="number"
                name="guidance_scale"
                value={formData.guidance_scale}
                onChange={handleInputChange}
                min="0"
                max="20"
                step="0.1"
                className="w-full text-xs rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

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

        {/* Chat History */}
        <div 
          ref={chatContainerRef} 
          className="flex-1 p-3 overflow-y-auto bg-gray-100 dark:bg-gray-900"
        >
          <div className="flex flex-col space-y-4">
            {imageHistory.map((image, index) => (
              <div key={index} className="max-w-lg mx-auto">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white dark:bg-gray-800 rounded overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow transition-shadow">
                      <div className="relative group aspect-auto flex justify-center bg-gray-50 dark:bg-gray-700">
                        <img 
                          src={image.url} 
                          alt={`Generated ${index}`} 
                          className="h-auto max-h-[280px] w-auto object-contain cursor-pointer" 
                          onClick={() => viewOriginalImage(image.url)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded"
                            onClick={() => viewOriginalImage(image.url)}
                          >
                            View Original
                          </button>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                        <span>{image.size}</span>
                        <span className="text-gray-400">#{imageHistory.length - index}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                ref={textareaRef}
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe the image you want to generate... (Press Enter to generate)"
                rows={2}
                className="w-full pl-3 pr-20 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 resize-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required
              />
              <button
                type="submit"
                disabled={loading || formData.prompt.trim() === ''}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-xs"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeFullImage}>
          <div className="relative max-w-4xl max-h-screen p-4">
            <button 
              className="absolute top-0 right-0 m-4 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
              onClick={closeFullImage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={fullImageUrl} 
              alt="Original Image" 
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
} 