'use client'

import { useState } from 'react'
import { format } from 'sql-formatter'

export default function SqlTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const formatSQL = () => {
    try {
      const formatted = format(input, {
        language: 'sql',
        uppercase: true,
        linesBetweenQueries: 1,
        indentStyle: 'standard'
      })
      setOutput(formatted)
      setError('')
    } catch (err) {
      setError('无效的 SQL 格式')
      setOutput('')
    }
  }

  const compressSQL = () => {
    try {
      const compressed = format(input, {
        language: 'sql',
        uppercase: true,
        linesBetweenQueries: 0,
        indentStyle: 'minimal'
      })
      setOutput(compressed)
      setError('')
    } catch (err) {
      setError('无效的 SQL 格式')
      setOutput('')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    setError('')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      setCopySuccess(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SQL 格式化工具</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">输入 SQL</label>
          <textarea
            value={input}
            onChange={handleInputChange}
            className="w-full h-64 p-2 border rounded-md font-mono"
            placeholder="输入要格式化的 SQL 语句..."
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={formatSQL}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            格式化
          </button>
          <button
            onClick={compressSQL}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            压缩
          </button>
        </div>

        {error && (
          <div className="text-red-500">{error}</div>
        )}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">输出结果</label>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                {copySuccess ? '已复制' : '复制'}
              </button>
            </div>
            <pre className="w-full p-2 border rounded-md bg-gray-50 font-mono whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 