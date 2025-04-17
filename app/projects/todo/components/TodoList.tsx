'use client'

import { useState } from 'react'
import { Todo, TodoFilter, useTodoStore } from '../store/todoStore'
import TodoItem from './TodoItem'

interface TodoListProps {
  filter: TodoFilter
}

export default function TodoList({ filter }: TodoListProps) {
  const { todos } = useTodoStore()
  
  // 先按照过滤条件筛选待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // 自定义排序：未完成的在上面（按创建时间倒序），已完成的在下面（按完成时间倒序）
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // 如果一个完成一个未完成，未完成的排在前面
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    // 如果都是已完成的，按完成时间倒序排列
    if (a.completed && b.completed) {
      // 确保有完成时间，否则回退到创建时间
      const aTime = a.completed_at || a.created_at
      const bTime = b.completed_at || b.created_at
      return new Date(bTime).getTime() - new Date(aTime).getTime()
    }
    
    // 如果都是未完成的，按创建时间倒序排列
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

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
    <div className="flex-1 space-y-2 overflow-y-auto py-2">
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
} 