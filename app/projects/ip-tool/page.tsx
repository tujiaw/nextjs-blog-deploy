'use client'

import { useState, useEffect } from 'react'

interface IpInfo {
  ip: string
  version: string
  country: string
  region: string
  city: string
  isp: string
  timezone: string
  latitude: number
  longitude: number
}

export default function IpTool() {
  const [input, setInput] = useState('')
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 获取当前 IP 地址
  const getCurrentIp = async () => {
    try {
      setLoading(true)
      // 尝试多个 API 获取当前 IP
      const apis = [
        'https://api.ipify.org?format=json',
        'https://api.ip.sb/ip',
        'https://api.myip.com'
      ]

      let currentIp = ''
      for (const api of apis) {
        try {
          const response = await fetch(api)
          const data = await response.json()
          currentIp = data.ip || data.ip_address
          if (currentIp) break
        } catch (err) {
          console.warn(`Failed to fetch from ${api}:`, err)
        }
      }

      if (!currentIp) {
        throw new Error('无法获取当前 IP 地址')
      }

      setInput(currentIp)
      await queryIp(currentIp)
    } catch (err) {
      setError('获取当前 IP 地址失败')
      console.error('Error getting current IP:', err)
    } finally {
      setLoading(false)
    }
  }

  // 查询 IP 地址信息
  const queryIp = async (ip: string) => {
    try {
      setLoading(true)
      setError('')
      
      // 验证 IP 地址格式
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
      const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
      
      if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
        throw new Error('无效的 IP 地址格式')
      }

      // 使用多个 API 作为备用
      const apis = [
        `https://ipapi.co/${ip}/json/`,
        `https://ip-api.com/json/${ip}`,
        `https://ipwho.is/${ip}`
      ]

      let data: any = null
      for (const api of apis) {
        try {
          const response = await fetch(api)
          if (!response.ok) continue
          
          data = await response.json()
          if (data.error) continue

          // 统一数据格式
          const ipInfo: IpInfo = {
            ip: data.ip,
            version: data.version || (ip.includes(':') ? 'IPv6' : 'IPv4'),
            country: data.country_name || data.country,
            region: data.region || data.region_name,
            city: data.city,
            isp: data.org || data.isp,
            timezone: data.timezone,
            latitude: data.latitude,
            longitude: data.longitude
          }

          setIpInfo(ipInfo)
          return
        } catch (err) {
          console.warn(`Failed to fetch from ${api}:`, err)
        }
      }

      throw new Error('无法获取 IP 信息')
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败')
      setIpInfo(null)
    } finally {
      setLoading(false)
    }
  }

  // 组件加载时获取当前 IP
  useEffect(() => {
    getCurrentIp()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      queryIp(input.trim())
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">IP 地址查询</h1>
      
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="输入要查询的 IP 地址..."
            disabled={loading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            查询
          </button>
        </form>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {ipInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-2">基本信息</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">IP 地址</dt>
                  <dd className="font-mono">{ipInfo.ip}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">IP 版本</dt>
                  <dd>{ipInfo.version}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">ISP</dt>
                  <dd>{ipInfo.isp}</dd>
                </div>
              </dl>
            </div>

            <div className="p-4 bg-white border rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-2">地理位置</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">国家</dt>
                  <dd>{ipInfo.country}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">地区</dt>
                  <dd>{ipInfo.region}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">城市</dt>
                  <dd>{ipInfo.city}</dd>
                </div>
              </dl>
            </div>

            <div className="p-4 bg-white border rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-2">时区信息</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">时区</dt>
                  <dd>{ipInfo.timezone}</dd>
                </div>
              </dl>
            </div>

            <div className="p-4 bg-white border rounded-md shadow-sm">
              <h2 className="text-lg font-semibold mb-2">坐标信息</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">纬度</dt>
                  <dd>{ipInfo.latitude}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">经度</dt>
                  <dd>{ipInfo.longitude}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 