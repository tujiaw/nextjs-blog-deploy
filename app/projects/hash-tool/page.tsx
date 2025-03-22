'use client'

import { useState, useCallback } from 'react'
import { createHash } from 'crypto'

export default function HashTool() {
  const [input, setInput] = useState('')
  const [md5, setMd5] = useState('')
  const [sha1, setSha1] = useState('')
  const [uppercase, setUppercase] = useState(false)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')

  // 计算哈希值
  const calculateHash = useCallback((text: string) => {
    try {
      const md5Hash = createHash('md5').update(text).digest('hex')
      const sha1Hash = createHash('sha1').update(text).digest('hex')
      
      setMd5(uppercase ? md5Hash.toUpperCase() : md5Hash)
      setSha1(uppercase ? sha1Hash.toUpperCase() : sha1Hash)
      setError('')
    } catch (err) {
      setError('计算哈希值时出错')
      setMd5('')
      setSha1('')
    }
  }, [uppercase])

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setInput(text)
    if (text) {
      calculateHash(text)
    } else {
      setMd5('')
      setSha1('')
    }
  }

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const buffer = await file.arrayBuffer()
      const text = new TextDecoder().decode(buffer)
      setInput(text)
      calculateHash(text)
    } catch (err) {
      setError('读取文件时出错')
      setMd5('')
      setSha1('')
    }
  }

  // 复制文本
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess('已复制')
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      setError('复制失败')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">H</span>
        </div>
        <h1 className="text-3xl font-bold">哈希工具</h1>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">输入</h2>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => {
                  setUppercase(e.target.checked)
                  if (input) calculateHash(input)
                }}
                className="rounded"
              />
              <span className="text-sm text-gray-600">大写</span>
            </label>
            <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer">
              上传文件
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <textarea
          className="w-full h-32 p-4 border rounded-lg font-mono"
          value={input}
          onChange={handleInputChange}
          placeholder="输入文本或上传文件..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">MD5</h2>
          <div className="flex gap-2">
            <div className="flex-1 p-4 bg-gray-50 rounded-lg font-mono break-all">
              {md5}
            </div>
            <button
              onClick={() => copyToClipboard(md5)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              {copySuccess === '已复制' ? '已复制' : '复制'}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">SHA1</h2>
          <div className="flex gap-2">
            <div className="flex-1 p-4 bg-gray-50 rounded-lg font-mono break-all">
              {sha1}
            </div>
            <button
              onClick={() => copyToClipboard(sha1)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              {copySuccess === '已复制' ? '已复制' : '复制'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
} 