'use client'

import { useState, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'
import { ChevronRight, Menu } from 'lucide-react'

import { Link } from '@/components/ui'

type TocItem = {
  value: string
  url: string
  depth: number
}

interface TableOfContentsProps {
  toc: TocItem[]
  className?: string
  'data-toc-container'?: boolean
}

const TableOfContents = (props: TableOfContentsProps) => {
  const { toc, className, ...rest } = props
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(`#${entry.target.id}`)
        }
      }
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0.1,
    })

    // 安全获取元素函数，处理无效的选择器
    const safelyGetElement = (url: string) => {
      try {
        // 如果是 ID 选择器但不合法（例如以数字开头或包含特殊字符）
        if (url.startsWith('#')) {
          const id = url.substring(1) // 去掉 # 符号
          return document.getElementById(id)
        }
        return document.querySelector(url)
      } catch (error) {
        console.error('Invalid selector:', url, error)
        return null
      }
    }

    for (const { url } of toc) {
      const element = safelyGetElement(url)
      if (element) {
        observer.observe(element)
      }
    }

    return () => {
      for (const { url } of toc) {
        const element = safelyGetElement(url)
        if (element) {
          observer.unobserve(element)
        }
      }
    }
  }, [toc])

  const toggleVisibility = useCallback(() => {
    setIsVisible(!isVisible)
  }, [isVisible])

  return (
    <div 
      className={clsx(
        'transition-all duration-300',
        className,
        isVisible ? 'w-full' : 'w-8'
      )}
      {...rest}
    >
      <button 
        type="button"
        className="flex cursor-pointer items-center gap-1 bg-transparent border-0 p-0 text-left" 
        onClick={toggleVisibility}
        aria-expanded={isVisible}
        aria-label={isVisible ? "隐藏目录" : "显示目录"}
      >
        {isVisible ? (
          <>
            <ChevronRight
              size={20}
              strokeWidth={1.5}
              className="rotate-90 transition-transform duration-300"
            />
            <span className="text-base font-medium">目录</span>
          </>
        ) : (
          <Menu size={20} strokeWidth={1.5} className="transition-transform duration-300" />
        )}
      </button>

      {isVisible && (
        <div className="mt-4">
          <ul className="scrollbar-hidden flex flex-col space-y-2 pr-2">
            {toc.map(({ value, depth, url }) => (
              <li
                key={url}
                className={clsx(
                  'text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
                  {
                    'text-gray-800 dark:text-primary-600': activeId === url,
                  }
                )}
                style={{ paddingLeft: (depth - 2) * 16 }}
              >
                <Link href={url}>{value}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Add custom scrollbar styles at the end of the file
const styleElement = typeof document !== 'undefined' ? document.createElement('style') : null

if (styleElement) {
  styleElement.textContent = `
    .scrollbar-hidden {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    
    .scrollbar-hidden::-webkit-scrollbar {
      display: none;  /* Chrome, Safari and Opera */
    }
  `

  document.head.appendChild(styleElement)
}

export default TableOfContents
