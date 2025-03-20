'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';

import { Link } from '@/components/ui';

type TocItem = {
  value: string;
  url: string;
  depth: number;
};

interface TableOfContentsProps {
  toc: TocItem[];
  className?: string;
}

const TableOfContents = (props: TableOfContentsProps) => {
  const { toc, className } = props;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0.1,
    });

    // 安全获取元素函数，处理无效的选择器
    const safelyGetElement = (url: string) => {
      try {
        // 如果是 ID 选择器但不合法（例如以数字开头或包含特殊字符）
        if (url.startsWith('#')) {
          const id = url.substring(1); // 去掉 # 符号
          return document.getElementById(id);
        }
        return document.querySelector(url);
      } catch (error) {
        console.error('Invalid selector:', url, error);
        return null;
      }
    };

    toc.forEach(({ url }) => {
      const element = safelyGetElement(url);

      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      toc.forEach(({ url }) => {
        const element = safelyGetElement(url);

        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [toc]);

  return (
    <details className={clsx('space-y-4 [&_.chevron-right]:open:rotate-90', className)} open>
      <summary className="flex cursor-pointer items-center gap-1 marker:content-none">
        <ChevronRight size={20} strokeWidth={1.5} className="chevron-right rotate-0 transition-transform" />
        <span className="text-base font-medium">Table of Contents</span>
      </summary>

      <ul className="flex flex-col space-y-2 pr-2 scrollbar-hidden">
        {toc.map(({ value, depth, url }) => (
          <li
            key={url}
            className={clsx('text-gray-500 dark:text-gray-400 text-sm transition-colors hover:text-gray-800 dark:hover:text-gray-200', {
              'text-gray-800 dark:text-primary-600': activeId === url,
            })}
            style={{ paddingLeft: (depth - 2) * 16 }}
          >
            <Link href={url}>{value}</Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

// Add custom scrollbar styles at the end of the file
const styleElement = typeof document !== 'undefined' ? 
  document.createElement('style') : null;

if (styleElement) {
  styleElement.textContent = `
    .scrollbar-hidden {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    
    .scrollbar-hidden::-webkit-scrollbar {
      display: none;  /* Chrome, Safari and Opera */
    }
  `;
  
  document.head.appendChild(styleElement);
}

export default TableOfContents;
