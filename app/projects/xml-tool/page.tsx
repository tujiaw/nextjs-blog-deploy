'use client'

import { useState } from 'react'
import { parseString } from 'xml2js'

export default function XmlTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')

  // 格式化 XML
  const formatXML = () => {
    try {
      parseString(input, (err, result) => {
        if (err) {
          setError('Invalid XML format')
          setOutput('')
          return
        }
        // 使用 xml2js 的 builder 来格式化
        const builder = new (require('xml2js').Builder)({
          renderOpts: { pretty: true, indent: '  ', newline: '\n' }
        })
        setOutput(builder.buildObject(result))
        setError('')
      })
    } catch (err) {
      setError('Invalid XML format')
      setOutput('')
    }
  }

  // 压缩 XML
  const compressXML = () => {
    try {
      parseString(input, (err, result) => {
        if (err) {
          setError('Invalid XML format')
          setOutput('')
          return
        }
        // 使用 xml2js 的 builder 来压缩
        const builder = new (require('xml2js').Builder)({
          renderOpts: { pretty: false }
        })
        setOutput(builder.buildObject(result))
        setError('')
      })
    } catch (err) {
      setError('Invalid XML format')
      setOutput('')
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
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">X</span>
        </div>
        <h1 className="text-3xl font-bold">XML格式化</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">输入</h2>
        <textarea
          className="w-full h-64 p-4 border rounded-lg font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入XML..."
        />
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={formatXML}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          格式化
        </button>
        <button
          onClick={compressXML}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          压缩
        </button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">输出</h2>
            <button
              onClick={() => copyToClipboard(output)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              {copySuccess === '已复制' ? '已复制' : '复制'}
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg font-mono whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
} 