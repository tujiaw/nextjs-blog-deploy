'use client'

import React from 'react'

interface FullImageModalProps {
  showFullImage: boolean
  fullImageUrl: string
  closeFullImage: () => void
}

const FullImageModal: React.FC<FullImageModalProps> = ({
  showFullImage,
  fullImageUrl,
  closeFullImage
}) => {
  if (!showFullImage) return null

  return (
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
  )
}

export default FullImageModal 