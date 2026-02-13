import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from '@mui/material'
import MoodSelector from './MoodSelector'
import type { DiaryEntry } from '../types'

// 入力制限の定数
const MAX_TITLE_LENGTH = 100
const MAX_CONTENT_LENGTH = 10000

interface DiaryDialogProps {
  open: boolean
  editingEntry: DiaryEntry | null
  title: string
  content: string
  mood: string
  onClose: () => void
  onSave: () => void
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onMoodChange: (mood: string) => void
}

export default function DiaryDialog({
  open,
  editingEntry,
  title,
  content,
  mood,
  onClose,
  onSave,
  onTitleChange,
  onContentChange,
  onMoodChange
}: DiaryDialogProps) {
  // バリデーション
  const isTitleValid = title.length <= MAX_TITLE_LENGTH
  const isContentValid = content.length <= MAX_CONTENT_LENGTH
  const isSaveDisabled = !title.trim() || !content.trim() || !isTitleValid || !isContentValid

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingEntry ? '日記を編集' : '新しい日記'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="タイトル"
            fullWidth
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            autoFocus
            error={!isTitleValid}
            helperText={
              !isTitleValid
                ? `タイトルは${MAX_TITLE_LENGTH}文字以内で入力してください`
                : `${title.length} / ${MAX_TITLE_LENGTH}`
            }
            inputProps={{ maxLength: MAX_TITLE_LENGTH + 50 }} // ユーザーが気づくように少し余裕を持たせる
          />
          <MoodSelector selectedMood={mood} onMoodChange={onMoodChange} />
          <TextField
            label="内容"
            fullWidth
            multiline
            rows={8}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            error={!isContentValid}
            helperText={
              !isContentValid
                ? `内容は${MAX_CONTENT_LENGTH}文字以内で入力してください`
                : `${content.length} / ${MAX_CONTENT_LENGTH}`
            }
            inputProps={{ maxLength: MAX_CONTENT_LENGTH + 500 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={isSaveDisabled}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}
