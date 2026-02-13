import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  IconButton,
  Chip
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { DiaryEntry } from '../types'

interface DiaryCardProps {
  entry: DiaryEntry
  onEdit: (entry: DiaryEntry) => void
  onDelete: (id: string) => void
}

export default function DiaryCard({ entry, onEdit, onDelete }: DiaryCardProps) {
  // 日付フォーマットをメモ化してパフォーマンス向上
  const formattedDate = useMemo(() => {
    const date = new Date(entry.date)
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }, [entry.date])

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {entry.mood && (
              <Typography variant="h4" sx={{ lineHeight: 1 }}>
                {entry.mood}
              </Typography>
            )}
            <Typography variant="h5" component="h2">
              {entry.title}
            </Typography>
          </Box>
          <Chip
            label={formattedDate}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ whiteSpace: 'pre-wrap', mt: 2 }}
        >
          {entry.content}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(entry)}
          aria-label="日記を編集"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(entry.id)}
          aria-label="日記を削除"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
