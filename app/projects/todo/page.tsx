'use client'

import { useEffect, useState } from 'react'
import TodoHeader from './components/TodoHeader'
import TodoTimeline from './components/TodoTimeline'
import TodoFooter from './components/TodoFooter'
import { TodoFilter, useTodoStore } from './store/todoStore'
import { useUser } from './hooks/useUser'
import LoginButton from './components/LoginButton'
import { Toaster } from './components/ui/Toaster'

export default function TodoApp() {
  const [filter, setFilter] = useState<TodoFilter>('active')
  const { user, isLoading } = useUser()
  const { fetchTodos, addTodo, todos } = useTodoStore()
  
  useEffect(() => {
    if (user) {
      fetchTodos(user.id)
    }
  }, [user, fetchTodos])

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col px-4">
      <div className="mb-4 space-y-1 pt-2 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            超级待办
          </span>
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          简单、美观、高效的待办事项管理
        </p>
      </div>

      {!user ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 dark:border-gray-700">
          <h3 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
            请登录以管理您的待办事项
          </h3>
          <LoginButton />
        </div>
      ) : (
        <div className="flex flex-1 flex-col rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <TodoHeader 
            onAddTodo={(text) => addTodo(text, user.id)} 
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <TodoTimeline filter={filter} />
          <TodoFooter 
            showCompletedCount={true}
          />
        </div>
      )}
      <Toaster />
    </div>
  )
} 