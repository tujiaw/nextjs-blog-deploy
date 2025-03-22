'use client'

import { useState } from 'react'
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'

interface UuidResult {
  id: string
  version: string
  timestamp?: string
}

export default function UuidTool() {
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState<'v1' | 'v4'>('v4')
  const [uppercase, setUppercase] = useState(false)
  const [results, setResults] = useState<UuidResult[]>([])
  const [copySuccess, setCopySuccess] = useState<{ [key: string]: boolean }>({})

  const generateUuid = () => {
    const newResults: UuidResult[] = []
    const now = new Date()

    for (let i = 0; i < count; i++) {
      const uuid = version === 'v1' ? uuidv1() : uuidv4()
      const formattedUuid = uppercase ? uuid.toUpperCase() : uuid.toLowerCase()
      
      newResults.push({
        id: formattedUuid,
        version: version,
        timestamp: version === 'v1' ? now.toISOString() : undefined
      })
    }

    setResults(newResults)
    setCopySuccess({})
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(prev => ({ ...prev, [text]: true }))
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [text]: false }))
      }, 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const copyAllToClipboard = async () => {
    const text = results.map(r => r.id).join('\n')
    await copyToClipboard(text)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">UUID 生成器</h1>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">UUID 版本</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as 'v1' | 'v4')}
              className="p-2 border rounded-md"
            >
              <option value="v1">UUID v1 (基于时间)</option>
              <option value="v4">UUID v4 (随机)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">生成数量</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="p-2 border rounded-md w-24"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">大写</span>
            </label>
          </div>

          <button
            onClick={generateUuid}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            生成
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">生成结果</h2>
              <button
                onClick={copyAllToClipboard}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                复制全部
              </button>
            </div>

            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex-1">
                    <div className="font-mono">{result.id}</div>
                    {result.timestamp && (
                      <div className="text-sm text-gray-500">
                        时间戳: {result.timestamp}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.id)}
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {copySuccess[result.id] ? '已复制' : '复制'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 