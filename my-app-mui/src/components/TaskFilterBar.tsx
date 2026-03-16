import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import type { TaskStatus, TaskPriority } from '../types'

interface TaskFilterBarProps {
  statusFilter: TaskStatus | 'all'
  priorityFilter: TaskPriority | 'all'
  onStatusChange: (value: TaskStatus | 'all') => void
  onPriorityChange: (value: TaskPriority | 'all') => void
}

export default function TaskFilterBar({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange
}: TaskFilterBarProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
      <ToggleButtonGroup
        value={statusFilter}
        exclusive
        onChange={(_e, value) => { if (value !== null) onStatusChange(value) }}
        size="small"
      >
        <ToggleButton value="all">すべて</ToggleButton>
        <ToggleButton value="todo">未完了</ToggleButton>
        <ToggleButton value="done">完了済み</ToggleButton>
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>優先度</InputLabel>
        <Select
          value={priorityFilter}
          label="優先度"
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
        >
          <MenuItem value="all">すべて</MenuItem>
          <MenuItem value="high">高</MenuItem>
          <MenuItem value="medium">中</MenuItem>
          <MenuItem value="low">低</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
