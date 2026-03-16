import { useState, useEffect } from 'react'
import type { Task, TaskStatus } from '../types'

const STORAGE_KEY = 'taskEntries'

export function useTaskStorage() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setTasks(parsed)
        } else {
          console.error('保存データの形式が不正です')
        }
      }
    } catch (error) {
      console.error('タスクデータの読み込みに失敗しました:', error)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    try {
      if (tasks.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('タスクデータの保存に失敗しました:', error)
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('ストレージの容量が不足しています。古いタスクを削除してください。')
      }
    }
  }, [tasks])

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newTask: Task = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...task
    }
    setTasks([newTask, ...tasks])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'todo' ? 'done' : 'todo' as TaskStatus, updatedAt: new Date().toISOString() }
        : task
    ))
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleStatus
  }
}
