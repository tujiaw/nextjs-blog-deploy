'use client'

import React from 'react'

interface ChatHistoryProps {
  chatContainerRef: React.RefObject<HTMLDivElement | null>
  imageHistory: {url: string, size: string}[]
  viewOriginalImage: (url: string) => void
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatContainerRef,
  imageHistory,
  viewOriginalImage
}) => {
  return (
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
  )
}

export default ChatHistory 