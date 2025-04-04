'use client';

import { useState, useEffect } from 'react';

export default function ClipboardPage() {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [savedCode, setSavedCode] = useState<number | null>(null);

  // Maximum content length (100K characters)
  const MAX_CONTENT_LENGTH = 500 * 1024;

  // Combined function to set message and message type
  const setMessageWithType = (text: string, type: 'success' | 'error' | null) => {
    setMessage(text);
    setMessageType(type);
  };

  // Load content from clipboard
  const loadFromClipboard = async () => {
    // Clear previous messages when loading
    setMessageWithType('', null);
    setSavedCode(null);
    
    if (!accessCode) {
      setMessageWithType('Please enter access code', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/clipboard?code=${accessCode}`);
      const data = await response.json();
      
      if (response.ok) {
        setContent(data.content || '');
        setMessageWithType('Content loaded from clipboard', 'success');
      } else {
        setMessageWithType(data.error || 'Loading failed, please check your access code', 'error');
      }
    } catch (error) {
      console.error('Failed to load clipboard content:', error);
      setMessageWithType('Loading failed, please try again', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Save content to clipboard
  const saveToClipboard = async () => {
    // Clear previous messages when saving
    setMessageWithType('', null);
    setSavedCode(null);
    
    // Check content length
    if (content.length > MAX_CONTENT_LENGTH) {
      setMessageWithType(`Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`, 'error');
      return;
    }
    
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
      } else {
        setMessageWithType('Save failed: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Failed to save to clipboard:', error);
      setMessageWithType('Save failed, please try again', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // No need to automatically load content when component mounts
  useEffect(() => {
    // No longer automatically load content
  }, []);
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Online Clipboard</h1>
      
      <div className="mb-4">
        <textarea 
          className="w-full p-2 border rounded-md min-h-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter content to save"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">
          {content.length} / {MAX_CONTENT_LENGTH} characters
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={saveToClipboard}
          disabled={isLoading || !content}
        >
          Save to Clipboard
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
            onClick={loadFromClipboard}
            disabled={isLoading || !accessCode || accessCode.length !== 4}
          >
            Load from Clipboard
          </button>
          <input
            type="text"
            className="w-[80px] p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 text-center"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Code"
            maxLength={4}
          />
        </div>
      </div>
      
      {savedCode && (
        <div className="mb-4 p-4 border rounded-md bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-300">Access Code</h2>
          <p className="text-green-700 dark:text-green-400">Please remember your access code: <span className="font-bold">{savedCode}</span></p>
          <p className="text-sm text-green-600 dark:text-green-500 mt-2">Use this code to load your content on other devices</p>
        </div>
      )}
      
      {message && (
        <div className={`p-2 rounded-md ${
          messageType === 'success' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
} 