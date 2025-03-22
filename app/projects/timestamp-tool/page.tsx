'use client'

import { useState, useEffect } from 'react'

export default function TimestampTool() {
  const [currentTime, setCurrentTime] = useState('')
  const [currentTimestamp, setCurrentTimestamp] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const [formattedTime, setFormattedTime] = useState('')
  const [timezone, setTimezone] = useState('Asia/Shanghai')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')

  // 更新当前时间
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString('zh-CN', { timeZone: timezone }))
      setCurrentTimestamp(Math.floor(now.getTime() / 1000).toString())
    }

    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 1000)
    return () => clearInterval(interval)
  }, [timezone])

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

  // 时间戳转格式化时间
  const timestampToTime = () => {
    try {
      const ts = parseInt(timestamp)
      if (isNaN(ts)) {
        throw new Error('Invalid timestamp')
      }
      const date = new Date(ts * 1000)
      setFormattedTime(date.toLocaleString('zh-CN', { timeZone: timezone }))
      setError('')
    } catch (err) {
      setError('Invalid timestamp')
      setFormattedTime('')
    }
  }

  // 格式化时间转时间戳
  const timeToTimestamp = () => {
    try {
      const date = new Date(formattedTime)
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date')
      }
      setTimestamp(Math.floor(date.getTime() / 1000).toString())
      setError('')
    } catch (err) {
      setError('Invalid date format')
      setTimestamp('')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <h1 className="text-3xl font-bold">时间戳转换</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">当前时间</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">
            <div className="flex-1 p-4 bg-gray-50 rounded-lg font-mono">
              {currentTime}
            </div>
            <button
              onClick={() => copyToClipboard(currentTime)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              {copySuccess === '已复制' ? '已复制' : '复制'}
            </button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 p-4 bg-gray-50 rounded-lg font-mono">
              {currentTimestamp}
            </div>
            <button
              onClick={() => copyToClipboard(currentTimestamp)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              {copySuccess === '已复制' ? '已复制' : '复制'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">时间戳</h2>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg font-mono"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="输入时间戳..."
            />
            <button
              onClick={timestampToTime}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              转换
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">格式化时间</h2>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg font-mono"
              value={formattedTime}
              onChange={(e) => setFormattedTime(e.target.value)}
              placeholder="输入格式化时间..."
            />
            <button
              onClick={timeToTimestamp}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              转换
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          时区
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="Asia/Shanghai">中国标准时间 (UTC+8)</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">纽约 (UTC-5)</option>
          <option value="Europe/London">伦敦 (UTC+0)</option>
          <option value="Asia/Tokyo">东京 (UTC+9)</option>
        </select>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
} 