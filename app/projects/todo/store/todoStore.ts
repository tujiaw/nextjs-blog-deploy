'use client'

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export type TodoFilter = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  text: string
  completed: boolean
  user_id: string
  created_at: string
  completed_at?: string | null
}

interface TodoStore {
  todos: Todo[]
  isLoading: boolean
  error: string | null
  
  // actions
  fetchTodos: (userId: string) => Promise<void>
  addTodo: (text: string, userId: string) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
  updateTodoText: (id: string, text: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  clearCompleted: () => Promise<void>
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async (userId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
      
      if (error) throw error
      set({ todos: data || [], isLoading: false })
    } catch (error) {
      console.error('Error fetching todos:', error)
      set({ error: '获取待办事项失败', isLoading: false })
    }
  },

  addTodo: async (text: string, userId: string) => {
    if (!text.trim()) return
    
    const newTodo: Omit<Todo, 'id' | 'created_at'> = {
      text,
      completed: false,
      user_id: userId,
    }
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert(newTodo)
        .select()
        .single()
      
      if (error) throw error
      set(state => ({ todos: [data, ...state.todos] }))
    } catch (error) {
      console.error('Error adding todo:', error)
      set({ error: '添加待办事项失败' })
    }
  },

  toggleTodo: async (id: string) => {
    const todo = get().todos.find(t => t.id === id)
    if (!todo) return
    
    const completed = !todo.completed
    const completed_at = completed ? new Date().toISOString() : null
    
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed, completed_at })
        .eq('id', id)
      
      if (error) throw error
      set(state => ({
        todos: state.todos.map(t => 
          t.id === id ? { ...t, completed, completed_at } : t
        )
      }))
    } catch (error) {
      console.error('Error toggling todo:', error)
      set({ error: '更新待办事项状态失败' })
    }
  },

  updateTodoText: async (id: string, text: string) => {
    if (!text.trim()) return
    
    try {
      const { error } = await supabase
        .from('todos')
        .update({ text })
        .eq('id', id)
      
      if (error) throw error
      set(state => ({
        todos: state.todos.map(t => 
          t.id === id ? { ...t, text } : t
        )
      }))
    } catch (error) {
      console.error('Error updating todo:', error)
      set({ error: '更新待办事项文本失败' })
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      set(state => ({
        todos: state.todos.filter(t => t.id !== id)
      }))
    } catch (error) {
      console.error('Error deleting todo:', error)
      set({ error: '删除待办事项失败' })
    }
  },

  clearCompleted: async () => {
    const completedTodos = get().todos.filter(t => t.completed)
    
    if (completedTodos.length === 0) return
    
    try {
      const completedIds = completedTodos.map(t => t.id)
      const { error } = await supabase
        .from('todos')
        .delete()
        .in('id', completedIds)
      
      if (error) throw error
      set(state => ({
        todos: state.todos.filter(t => !t.completed)
      }))
    } catch (error) {
      console.error('Error clearing completed todos:', error)
      set({ error: '清除已完成事项失败' })
    }
  }
})) 