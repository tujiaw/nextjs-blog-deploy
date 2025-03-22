'use client'

import { useState, useCallback, useEffect } from 'react'
import { createHash } from 'crypto'

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'crc32'

interface HashResult {
  value: string
  name: string
  length: number
}

export default function HashTool() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<HashResult[]>([])
  const [uppercase, setUppercase] = useState(false)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')

  // 计算CRC32
  const calculateCRC32 = (text: string): string => {
    // 预计算 CRC32 表以提高性能
    const crc32Table = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let crc = i
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0)
      }
      crc32Table[i] = crc
    }

    let crc = 0xffffffff
    for (let i = 0; i < text.length; i++) {
      crc = (crc >>> 8) ^ crc32Table[(crc ^ text.charCodeAt(i)) & 0xff]
    }
    return (crc ^ 0xffffffff).toString(16).padStart(8, '0')
  }

  // 测试用例
  const testCRC32 = () => {
    const testCases = [
      { input: '', expected: '00000000' },
      { input: 'The quick brown fox jumps over the lazy dog', expected: '414fa339' },
      { input: '123456789', expected: 'cbf43926' },
      { input: 'Hello, World!', expected: 'ebe6c6e6' }
    ]

    testCases.forEach(({ input, expected }) => {
      const result = calculateCRC32(input)
      console.log(`Input: "${input}"`)
      console.log(`Expected: ${expected}`)
      console.log(`Got: ${result}`)
      console.log(`Match: ${result === expected}`)
    })
  }

  // 在组件加载时运行测试
  useEffect(() => {
    testCRC32()
  }, [])

  // 计算哈希值
  const calculateHash = useCallback((text: string) => {
    try {
      const results: HashResult[] = [
        {
          name: 'MD5',
          value: createHash('md5').update(text).digest('hex'),
          length: 32
        },
        {
          name: 'SHA1',
          value: createHash('sha1').update(text).digest('hex'),
          length: 40
        },
        {
          name: 'SHA256',
          value: createHash('sha256').update(text).digest('hex'),
          length: 64
        },
        {
          name: 'SHA512',
          value: createHash('sha512').update(text).digest('hex'),
          length: 128
        },
        {
          name: 'CRC32',
          value: calculateCRC32(text),
          length: 8
        }
      ]

      setHashes(results.map(hash => ({
        ...hash,
        value: uppercase ? hash.value.toUpperCase() : hash.value
      })))
      setError('')
    } catch (err) {
      setError('计算哈希值时出错')
      setHashes([])
    }
  }, [uppercase])

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setInput(text)
    if (text) {
      calculateHash(text)
    } else {
      setHashes([])
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
      setHashes([])
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

      <div className="grid grid-cols-1 gap-4">
        {hashes.map((hash) => (
          <div key={hash.name}>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold">{hash.name}</h2>
              <span className="text-sm text-gray-500">({hash.length}位)</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 p-4 bg-gray-50 rounded-lg font-mono break-all">
                {hash.value}
              </div>
              <button
                onClick={() => copyToClipboard(hash.value)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                {copySuccess === '已复制' ? '已复制' : '复制'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
} 