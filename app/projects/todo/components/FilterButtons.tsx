'use client'

import { TodoFilter } from '../store/todoStore'

interface FilterButtonsProps {
  activeFilter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
}

export default function FilterButtons({
  activeFilter,
  onFilterChange,
}: FilterButtonsProps) {
  return (
    <div className="flex rounded-md border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onFilterChange('all')}
        className={`rounded-l-md px-3 py-1 text-sm ${
          activeFilter === 'all' 
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        全部
      </button>
      <button
        onClick={() => onFilterChange('active')}
        className={`border-l border-r border-gray-200 px-3 py-1 text-sm dark:border-gray-700 ${
          activeFilter === 'active' 
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        未完成
      </button>
      <button
        onClick={() => onFilterChange('completed')}
        className={`rounded-r-md px-3 py-1 text-sm ${
          activeFilter === 'completed' 
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        已完成
      </button>
    </div>
  )
} 