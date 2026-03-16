// 気分の絵文字の厳密な型定義
export type MoodEmoji = '😊' | '😢' | '😠' | '😴' | '🤩' | '😌' | '😰' | '🤔'

export interface DiaryEntry {
  id: string
  title: string
  content: string
  date: string
  mood?: MoodEmoji
}

export interface MoodOption {
  emoji: MoodEmoji
  label: string
}

export const moodOptions: MoodOption[] = [
  { emoji: '😊', label: '嬉しい' },
  { emoji: '😢', label: '悲しい' },
  { emoji: '😠', label: '怒り' },
  { emoji: '😴', label: '疲れた' },
  { emoji: '🤩', label: '興奮' },
  { emoji: '😌', label: '穏やか' },
  { emoji: '😰', label: '不安' },
  { emoji: '🤔', label: '考え中' },
]

// タスク管理用の型定義
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'todo' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  category: string
  tags: string[]
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export const PRIORITY_OPTIONS = [
  { value: 'high',   label: '高', color: 'error' },
  { value: 'medium', label: '中', color: 'warning' },
  { value: 'low',    label: '低', color: 'success' },
] as const

// 株価チャート用の型定義
export interface PriceData {
  date: string
  price: number
}

export interface StockData {
  name: string
  symbol: string
  data: PriceData[]
  lastUpdated: string
}
