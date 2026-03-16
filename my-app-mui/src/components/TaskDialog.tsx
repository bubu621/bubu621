import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack
} from '@mui/material'
import type { Task, TaskPriority } from '../types'
import { PRIORITY_OPTIONS } from '../types'

interface TaskFormState {
  title: string
  description: string
  priority: TaskPriority
  category: string
  tags: string
  dueDate: string
}

interface TaskDialogProps {
  open: boolean
  editingTask: Task | null
  formState: TaskFormState
  onClose: () => void
  onSave: () => void
  onFormChange: (field: keyof TaskFormState, value: string) => void
}

export default function TaskDialog({
  open,
  editingTask,
  formState,
  onClose,
  onSave,
  onFormChange
}: TaskDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingTask ? 'タスクを編集' : 'タスクを追加'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="タイトル"
            value={formState.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="説明"
            value={formState.description}
            onChange={(e) => onFormChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="優先度"
            value={formState.priority}
            onChange={(e) => onFormChange('priority', e.target.value)}
            select
            fullWidth
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="カテゴリ"
            value={formState.category}
            onChange={(e) => onFormChange('category', e.target.value)}
            fullWidth
          />
          <TextField
            label="タグ（カンマ区切り）"
            value={formState.tags}
            onChange={(e) => onFormChange('tags', e.target.value)}
            fullWidth
            placeholder="例: 仕事, 重要, レビュー"
          />
          <TextField
            label="期限日"
            type="date"
            value={formState.dueDate}
            onChange={(e) => onFormChange('dueDate', e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!formState.title.trim()}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}
