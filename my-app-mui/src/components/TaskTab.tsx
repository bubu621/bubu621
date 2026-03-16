import { useState, useMemo } from 'react'
import {
  Box,
  Stack,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useTaskStorage } from '../hooks/useTaskStorage'
import type { Task, TaskPriority, TaskStatus } from '../types'
import TaskFilterBar from './TaskFilterBar'
import TaskCard from './TaskCard'
import TaskDialog from './TaskDialog'
import TaskEmptyState from './TaskEmptyState'

interface TaskFormState {
  title: string
  description: string
  priority: TaskPriority
  category: string
  tags: string
  dueDate: string
}

const initialFormState: TaskFormState = {
  title: '',
  description: '',
  priority: 'medium',
  category: '',
  tags: '',
  dueDate: ''
}

export default function TaskTab() {
  const { tasks, addTask, updateTask, deleteTask, toggleStatus } = useTaskStorage()
  const [open, setOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formState, setFormState] = useState<TaskFormState>(initialFormState)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
      return true
    })
  }, [tasks, statusFilter, priorityFilter])

  const handleOpen = () => {
    setEditingTask(null)
    setFormState(initialFormState)
    setOpen(true)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormState({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      tags: task.tags.join(', '),
      dueDate: task.dueDate ?? ''
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingTask(null)
    setFormState(initialFormState)
  }

  const handleFormChange = (field: keyof TaskFormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!formState.title.trim()) return

    const taskData = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      priority: formState.priority,
      status: (editingTask?.status ?? 'todo') as TaskStatus,
      category: formState.category.trim(),
      tags: formState.tags.split(',').map(s => s.trim()).filter(Boolean),
      dueDate: formState.dueDate || null
    }

    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      addTask(taskData)
    }
    handleClose()
  }

  const handleDelete = (id: string) => {
    setDeletingTaskId(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId)
      setDeleteConfirmOpen(false)
      setDeletingTaskId(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setDeletingTaskId(null)
  }

  return (
    <Box>
      <TaskFilterBar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      {filteredTasks.length === 0 ? (
        <TaskEmptyState />
      ) : (
        <Stack spacing={2}>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={toggleStatus}
            />
          ))}
        </Stack>
      )}

      <Fab
        color="primary"
        aria-label="新しいタスクを追加"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      <TaskDialog
        open={open}
        editingTask={editingTask}
        formState={formState}
        onClose={handleClose}
        onSave={handleSave}
        onFormChange={handleFormChange}
      />

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>タスクを削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このタスクを削除してもよろしいですか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} autoFocus>キャンセル</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">削除</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
