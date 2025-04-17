'use client'

import { useMemo } from 'react'
import { Todo, TodoFilter, useTodoStore } from '../store/todoStore'
import TodoItem from './TodoItem'

interface TodoTimelineProps {
  filter: TodoFilter
}

// 获取日期的格式化字符串，用于分组
const getDateString = (dateString: string): string => {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '未知日期'
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  if (taskDate.getTime() === today.getTime()) {
    return '今天'
  } else if (taskDate.getTime() === yesterday.getTime()) {
    return '昨天'
  } else {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
}

// 获取日期的时间戳，用于排序
const getDateTimestamp = (dateString: string): number => {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 0
  
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime()
}

export default function TodoTimeline({ filter }: TodoTimelineProps) {
  const { todos } = useTodoStore()

  // 先按照过滤条件筛选待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // 按日期对待办事项进行分组
  const groupedTodos = useMemo(() => {
    const groups: { [key: string]: Todo[] } = {}
    
    filteredTodos.forEach(todo => {
      const dateKey = getDateString(todo.created_at)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(todo)
    })
    
    // 对每个组内的待办事项进行排序
    Object.keys(groups).forEach(dateKey => {
      groups[dateKey].sort((a, b) => {
        // 先按完成状态排序：未完成的排在前面
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1
        }
        
        // 如果都是已完成的，按完成时间倒序排列
        if (a.completed && b.completed) {
          const aTime = a.completed_at || a.created_at
          const bTime = b.completed_at || b.created_at
          return new Date(bTime).getTime() - new Date(aTime).getTime()
        }
        
        // 如果都是未完成的，按创建时间倒序排列
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    })
    
    return groups
  }, [filteredTodos])
  
  // 获取排序后的日期键
  const sortedDateKeys = useMemo(() => {
    return Object.keys(groupedTodos).sort((a, b) => {
      // 保证"今天"和"昨天"总是排在最前面
      if (a === '今天') return -1
      if (b === '今天') return 1
      if (a === '昨天') return -1
      if (b === '昨天') return 1
      
      // 其他日期按时间戳倒序排列
      const aTimestamp = getDateTimestamp(a)
      const bTimestamp = getDateTimestamp(b)
      return bTimestamp - aTimestamp
    })
  }, [groupedTodos])

  if (todos.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <svg
          className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-center text-gray-500 dark:text-gray-400">
          你的待办清单是空的，<br />
          添加一些待办事项开始使用吧！
        </p>
      </div>
    )
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <p className="text-center text-gray-500 dark:text-gray-400">
          {filter === 'active' ? '没有未完成的待办事项' : '没有已完成的待办事项'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {sortedDateKeys.map(dateKey => (
        <div key={dateKey} className="mb-6">
          <div className="mb-3 flex items-center">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            <h3 className="mx-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
              {dateKey}
            </h3>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          </div>
          
          <div className="relative pl-6">
            {/* 时间轴线 */}
            <div className="absolute left-2 top-0 bottom-0 w-px bg-blue-200 dark:bg-blue-900"></div>
            
            <div className="space-y-3">
              {groupedTodos[dateKey].map(todo => (
                <div key={todo.id} className="relative">
                  {/* 时间轴圆点 */}
                  <div className={`absolute -left-6 top-3 h-3 w-3 rounded-full border-2 ${
                    todo.completed 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-blue-500 bg-white dark:bg-gray-800'
                  }`}></div>
                  <TodoItem todo={todo} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 