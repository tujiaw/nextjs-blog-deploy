'use client'

import { useState } from 'react'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (err) {
      setError('Invalid JSON format')
      setOutput('')
    }
  }

  const compressJSON = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (err) {
      setError('Invalid JSON format')
      setOutput('')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">J</span>
        </div>
        <h1 className="text-3xl font-bold">JSON Formatter</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Input</h2>
          <textarea
            className="w-full h-96 p-4 border rounded-lg font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Output</h2>
          <textarea
            className="w-full h-96 p-4 border rounded-lg font-mono bg-gray-50"
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-4 flex gap-4">
        <button
          onClick={formatJSON}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Format
        </button>
        <button
          onClick={compressJSON}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Compress
        </button>
      </div>
    </div>
  )
} 