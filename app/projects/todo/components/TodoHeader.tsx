'use client'

import { useState, KeyboardEvent, FormEvent } from 'react'
import { useUser } from '../hooks/useUser'
import { useTodoStore } from '../store/todoStore'
import { TodoFilter } from '../store/todoStore'
import FilterButtons from './FilterButtons'

interface TodoHeaderProps {
  onAddTodo: (text: string) => void
  activeFilter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
}

export default function TodoHeader({ onAddTodo, activeFilter, onFilterChange }: TodoHeaderProps) {
  const [text, setText] = useState('')
  const { user, signOut } = useUser()
  const { todos } = useTodoStore()
  
  // 计算未完成待办事项的数量
  const activeCount = todos.filter(todo => !todo.completed).length

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    
    onAddTodo(text)
    setText('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            我的待办
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            你好，{user?.email?.split('@')[0] || '用户'}
            {activeCount > 0 && (
              <span className="ml-1">
                ，你有 <span className="font-medium text-blue-600 dark:text-blue-400">{activeCount}</span> 项待办未完成
              </span>
            )}
            {activeCount === 0 && (
              <span className="ml-1">，恭喜你已完成所有待办</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <FilterButtons activeFilter={activeFilter} onFilterChange={onFilterChange} />
          
          <button
            onClick={signOut}
            className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            退出
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="添加新待办事项..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 p-1 text-white transition hover:bg-blue-700"
          aria-label="添加待办事项"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </form>
    </div>
  )
} 