import { useState, useEffect } from 'react'
import type { DiaryEntry } from '../types'

const STORAGE_KEY = 'diaryEntries'

export function useDiaryStorage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])

  // ローカルストレージから読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // 配列であることを検証
        if (Array.isArray(parsed)) {
          setEntries(parsed)
        } else {
          console.error('保存データの形式が不正です')
        }
      }
    } catch (error) {
      console.error('日記データの読み込みに失敗しました:', error)
      // 破損したデータをクリア
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // ローカルストレージに保存
  useEffect(() => {
    try {
      if (entries.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      // QuotaExceededError などのエラーハンドリング
      console.error('日記データの保存に失敗しました:', error)
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('ストレージの容量が不足しています。古い日記を削除してください。')
      }
    }
  }, [entries])

  const addEntry = (entry: Omit<DiaryEntry, 'id' | 'date'>) => {
    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(), // より安全なユニークID生成
      date: new Date().toISOString(),
      ...entry
    }
    setEntries([newEntry, ...entries])
  }

  const updateEntry = (id: string, updates: Partial<DiaryEntry>) => {
    setEntries(entries.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    ))
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry
  }
}
