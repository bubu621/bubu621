import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Stack,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tabs,
  Tab
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import BookIcon from '@mui/icons-material/Book'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import DiaryCard from './components/DiaryCard'
import DiaryDialog from './components/DiaryDialog'
import EmptyState from './components/EmptyState'
import OrkanChart from './components/OrkanChart'
import { useDiaryStorage } from './hooks/useDiaryStorage'
import type { DiaryEntry, MoodEmoji } from './types'

// フォーム状態の型定義
interface FormState {
  title: string
  content: string
  mood: MoodEmoji | ''
}

// 初期フォーム状態
const initialFormState: FormState = {
  title: '',
  content: '',
  mood: ''
}

function App() {
  const { entries, addEntry, updateEntry, deleteEntry } = useDiaryStorage()
  const [open, setOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null)
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState(0)

  const handleOpen = () => {
    setEditingEntry(null)
    setFormState(initialFormState)
    setOpen(true)
  }

  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry)
    setFormState({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || ''
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingEntry(null)
    setFormState(initialFormState)
  }

  const handleSave = () => {
    if (!formState.title.trim() || !formState.content.trim()) return

    const entryData = {
      title: formState.title,
      content: formState.content,
      mood: formState.mood || undefined
    }

    if (editingEntry) {
      updateEntry(editingEntry.id, entryData)
    } else {
      addEntry(entryData)
    }
    handleClose()
  }

  const handleDelete = (id: string) => {
    setDeletingEntryId(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deletingEntryId) {
      deleteEntry(deletingEntryId)
      setDeleteConfirmOpen(false)
      setDeletingEntryId(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setDeletingEntryId(null)
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, mb: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
          <BookIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1" align="center">
            マイアプリ
          </Typography>
        </Box>

        {/* タブナビゲーション */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={(_e, value) => setCurrentTab(value)} centered>
            <Tab label="日記帳" icon={<BookIcon />} iconPosition="start" />
            <Tab label="トヨタ株チャート" icon={<TrendingUpIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* 日記帳タブ */}
        {currentTab === 0 && (
          <>
            {entries.length === 0 ? (
              <EmptyState />
            ) : (
              <Stack spacing={3}>
                {entries.map((entry) => (
                  <DiaryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </Stack>
            )}
          </>
        )}

        {/* トヨタ株チャートタブ */}
        {currentTab === 1 && <OrkanChart />}
      </Box>

      {/* フローティングアクションボタン（日記帳タブのみ表示） */}
      {currentTab === 0 && (
        <Fab
          color="primary"
          aria-label="新しい日記を追加"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleOpen}
        >
          <AddIcon />
        </Fab>
      )}

      {/* 日記追加/編集ダイアログ */}
      <DiaryDialog
        open={open}
        editingEntry={editingEntry}
        title={formState.title}
        content={formState.content}
        mood={formState.mood}
        onClose={handleClose}
        onSave={handleSave}
        onTitleChange={(title) => setFormState(prev => ({ ...prev, title }))}
        onContentChange={(content) => setFormState(prev => ({ ...prev, content }))}
        onMoodChange={(mood) => setFormState(prev => ({ ...prev, mood: mood as MoodEmoji | '' }))}
      />

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          日記を削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            この日記を削除してもよろしいですか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} autoFocus>
            キャンセル
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default App
