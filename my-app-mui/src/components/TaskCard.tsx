import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Checkbox,
  Stack
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Task } from '../types'
import { PRIORITY_OPTIONS } from '../types'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const priorityOpt = PRIORITY_OPTIONS.find(p => p.value === task.priority)
  const isDone = task.status === 'done'

  const isOverdue = task.dueDate && !isDone && new Date(task.dueDate) < new Date()

  return (
    <Card variant="outlined" sx={{ opacity: isDone ? 0.7 : 1 }}>
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Checkbox
            checked={isDone}
            onChange={() => onToggleStatus(task.id)}
            sx={{ mt: -0.5 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ textDecoration: isDone ? 'line-through' : 'none', fontSize: '1rem' }}
            >
              {task.title}
            </Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.description}
              </Typography>
            )}
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
              {priorityOpt && (
                <Chip
                  label={`優先度: ${priorityOpt.label}`}
                  color={priorityOpt.color as 'error' | 'warning' | 'success'}
                  size="small"
                />
              )}
              {task.category && (
                <Chip label={task.category} size="small" variant="outlined" />
              )}
              {task.tags.map(tag => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
              {task.dueDate && (
                <Chip
                  label={`期限: ${task.dueDate}`}
                  size="small"
                  color={isOverdue ? 'error' : 'default'}
                />
              )}
            </Stack>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <IconButton size="small" onClick={() => onEdit(task)} aria-label="編集">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(task.id)} aria-label="削除" color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  )
}
