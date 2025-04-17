'use client'

import { useTodoStore } from '../store/todoStore'

interface TodoFooterProps {
  showCompletedCount?: boolean
}

export default function TodoFooter({
  showCompletedCount = false,
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
        {showCompletedCount && completedTodos.length > 0 && 
          <span className="ml-2">• {completedTodos.length} 项已完成</span>
        }
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