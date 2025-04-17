'use client'

import { TodoFilter, useTodoStore } from '../store/todoStore'

interface TodoFooterProps {
  activeFilter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
}

export default function TodoFooter({
  activeFilter,
  onFilterChange,
}: TodoFooterProps) {
  const { todos, clearCompleted } = useTodoStore()
  
  const activeTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)
  const hasCompletedTodos = completedTodos.length > 0

  if (todos.length === 0) {
    return null
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
      <div className="text-gray-500 dark:text-gray-400">
        {activeTodos.length} 项未完成
      </div>
      
      <div className="flex rounded-md border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onFilterChange('all')}
          className={`rounded-l-md px-3 py-1 ${
            activeFilter === 'all' 
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`border-l border-r border-gray-200 px-3 py-1 dark:border-gray-700 ${
            activeFilter === 'active' 
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          未完成
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`rounded-r-md px-3 py-1 ${
            activeFilter === 'completed' 
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          已完成
        </button>
      </div>
      
      <button
        onClick={clearCompleted}
        className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ${
          !hasCompletedTodos ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={!hasCompletedTodos}
      >
        清除已完成
      </button>
    </div>
  )
} 