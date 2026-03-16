import { Box, Typography } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'

export default function TaskEmptyState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
        color: 'text.secondary'
      }}
    >
      <AssignmentIcon sx={{ fontSize: 64, opacity: 0.3 }} />
      <Typography variant="h6">タスクがありません</Typography>
      <Typography variant="body2">右下の「+」ボタンでタスクを追加してください</Typography>
    </Box>
  )
}
