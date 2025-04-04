'use client';

import { useState, useEffect } from 'react';

export default function ClipboardPage() {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [savedCode, setSavedCode] = useState<number | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);

  // 从剪贴板加载内容
  const loadFromClipboard = async () => {
    if (!accessCode) {
      setMessage('请输入访问码');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/clipboard?code=${accessCode}`);
      const data = await response.json();
      
      if (response.ok) {
        setContent(data.content || '');
        setMessage('内容已从剪贴板加载');
      } else {
        setMessage(data.error || '加载失败，请检查访问码是否正确');
      }
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
        setSavedCode(data.code);
        // 不再显示重复的保存成功消息
        setMessage('');
        // 不再自动显示访问码输入控件
        // setShowCodeInput(true);
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
  
  // 组件加载时不需要自动加载内容
  useEffect(() => {
    // 不再自动加载内容
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
          disabled={isLoading || !content}
        >
          保存到剪贴板
        </button>
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
          onClick={() => setShowCodeInput(!showCodeInput)}
        >
          {showCodeInput ? '隐藏访问码输入' : '从剪贴板加载'}
        </button>
      </div>
      
      {showCodeInput && (
        <div className="mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">输入访问码</h2>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="输入4位访问码 (1000-9999)"
              maxLength={4}
            />
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
              onClick={loadFromClipboard}
              disabled={isLoading || !accessCode || accessCode.length !== 4}
            >
              加载
            </button>
          </div>
        </div>
      )}
      
      {savedCode && (
        <div className="mb-4 p-4 border rounded-md bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-300">访问码</h2>
          <p className="text-green-700 dark:text-green-400">请记住您的访问码: <span className="font-bold">{savedCode}</span></p>
          <p className="text-sm text-green-600 dark:text-green-500 mt-2">使用此访问码可以在其他设备上加载您保存的内容</p>
        </div>
      )}
      
      {message && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100">
          {message}
        </div>
      )}
    </div>
  );
} 