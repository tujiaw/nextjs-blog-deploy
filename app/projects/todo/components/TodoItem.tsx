'use client'

import { useState, useRef, useEffect } from 'react'
import { Todo, useTodoStore } from '../store/todoStore'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toggleTodo, deleteTodo, updateTodoText } = useTodoStore()

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }

  const handleUpdate = () => {
    if (editText.trim() === '') {
      setEditText(todo.text)
      setIsEditing(false)
      return
    }

    if (editText !== todo.text) {
      updateTodoText(todo.id, editText)
    }
    
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate()
    } else if (e.key === 'Escape') {
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  return (
    <div className={`group relative flex items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 ${todo.completed ? 'opacity-70' : ''}`}>
      <button
        onClick={() => toggleTodo(todo.id)}
        className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
          todo.completed 
            ? 'border-blue-500 bg-blue-500 text-white' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        aria-label={todo.completed ? "标记为未完成" : "标记为已完成"}
      >
        {todo.completed && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent px-1 py-0.5 text-gray-700 outline-none focus:ring-0 dark:text-white"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          className={`flex-1 cursor-pointer ${todo.completed ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-700 dark:text-white'}`}
          onClick={handleEdit}
        >
          {todo.text}
        </div>
      )}
      
      <button
        onClick={() => deleteTodo(todo.id)}
        className="ml-2 hidden rounded p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-500 group-hover:block dark:hover:bg-red-900"
        aria-label="删除"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
} 