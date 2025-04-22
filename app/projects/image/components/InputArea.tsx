'use client'

import React from 'react'

interface InputAreaProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  formData: {
    prompt: string
  }
  loading: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  handleSubmit: (e: React.FormEvent) => void
}

const InputArea: React.FC<InputAreaProps> = ({
  textareaRef,
  formData,
  loading,
  handleInputChange,
  handleKeyDown,
  handleSubmit
}) => {
  return (
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
            disabled={!loading && formData.prompt.trim() === ''}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-xs"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Stop</span>
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
  )
}

export default InputArea 