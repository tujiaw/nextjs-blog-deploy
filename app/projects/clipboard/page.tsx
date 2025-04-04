'use client';

import { useState, useEffect } from 'react';

export default function ClipboardPage() {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 从剪贴板加载内容
  const loadFromClipboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/clipboard');
      const data = await response.json();
      setContent(data.content || '');
      setMessage('内容已从剪贴板加载');
    } catch (error) {
      console.error('加载剪贴板内容失败:', error);
      setMessage('加载失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 保存内容到剪贴板
  const saveToClipboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/clipboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage('内容已成功保存到剪贴板');
      } else {
        setMessage('保存失败: ' + (data.error || '未知错误'));
      }
    } catch (error) {
      console.error('保存到剪贴板失败:', error);
      setMessage('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件加载时获取剪贴板内容
  useEffect(() => {
    loadFromClipboard();
  }, []);
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">在线剪贴板</h1>
      
      <div className="mb-4">
        <textarea 
          className="w-full p-2 border rounded-md min-h-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入要保存的内容"
        />
      </div>
      
      <div className="flex gap-2 mb-4">
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
          onClick={saveToClipboard}
          disabled={isLoading}
        >
          保存到剪贴板
        </button>
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
          onClick={loadFromClipboard}
          disabled={isLoading}
        >
          从剪贴板加载
        </button>
      </div>
      
      {message && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100">
          {message}
        </div>
      )}
    </div>
  );
} 