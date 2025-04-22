'use client'

import { useState } from 'react'

const modelOptions = ['Kwai-Kolors/Kolors']
const imageSizeOptions = ['1024x1024', '960x1280', '768x1024', '720x1440', '720x1280']

export default function ImageGeneration() {
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.images && data.images[0]) {
        setGeneratedImage(data.images[0].url)
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batch_size' || name === 'seed' || name === 'num_inference_steps' 
        ? parseInt(value) 
        : name === 'guidance_scale' 
          ? parseFloat(value)
          : value
    }))
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-1 pb-4 pt-3 md:space-y-2">
        <h1 className="text-2xl font-extrabold leading-8 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12">
          Image Generation
        </h1>
        <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
          Generate images using AI with customizable parameters
        </p>
      </div>

      <div className="container py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Model
              </label>
              <select
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
              >
                {modelOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image Size
              </label>
              <select
                name="image_size"
                value={formData.image_size}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
              >
                {imageSizeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Prompt
              </label>
              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Negative Prompt
              </label>
              <textarea
                name="negative_prompt"
                value={formData.negative_prompt}
                onChange={handleInputChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Batch Size (1-4)
              </label>
              <input
                type="number"
                name="batch_size"
                value={formData.batch_size}
                onChange={handleInputChange}
                min="1"
                max="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Seed (0-9999999999)
              </label>
              <input
                type="number"
                name="seed"
                value={formData.seed}
                onChange={handleInputChange}
                min="0"
                max="9999999999"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Inference Steps (1-100)
              </label>
              <input
                type="number"
                name="num_inference_steps"
                value={formData.num_inference_steps}
                onChange={handleInputChange}
                min="1"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Guidance Scale (0-20)
              </label>
              <input
                type="number"
                name="guidance_scale"
                value={formData.guidance_scale}
                onChange={handleInputChange}
                min="0"
                max="20"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-md bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </div>
        </form>

        {generatedImage && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Generated Image</h2>
            <div className="overflow-hidden rounded-lg">
              <img src={generatedImage} alt="Generated" className="w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 