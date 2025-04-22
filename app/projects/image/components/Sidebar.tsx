'use client'

import React from 'react'

interface SidebarProps {
  sidebarOpen: boolean
  formData: {
    model: string
    negative_prompt: string
    image_size: string
    batch_size: number
    num_inference_steps: number
    guidance_scale: number
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  modelOptions: string[]
  imageSizeOptions: string[]
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  formData,
  handleInputChange,
  modelOptions,
  imageSizeOptions
}) => {
  return (
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
  )
}

export default Sidebar 