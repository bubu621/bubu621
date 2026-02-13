import { Box, Typography } from '@mui/material'
import { moodOptions } from '../types'
import type { MoodEmoji } from '../types'

interface MoodSelectorProps {
  selectedMood: string
  onMoodChange: (mood: string) => void
}

export default function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
  // キーボード操作のハンドラー
  const handleKeyDown = (emoji: MoodEmoji, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onMoodChange(emoji)
    }
  }

  return (
    <Box role="radiogroup" aria-label="今日の気分">
      <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
        今日の気分
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {moodOptions.map((option) => (
          <Box
            key={option.emoji}
            component="button"
            type="button"
            role="radio"
            aria-checked={selectedMood === option.emoji}
            aria-label={option.label}
            tabIndex={0}
            onClick={() => onMoodChange(option.emoji)}
            onKeyDown={(e) => handleKeyDown(option.emoji, e)}
            sx={{
              cursor: 'pointer',
              padding: 1.5,
              borderRadius: 2,
              border: '2px solid',
              borderColor: selectedMood === option.emoji ? 'primary.main' : 'grey.300',
              backgroundColor: selectedMood === option.emoji ? 'primary.light' : 'transparent',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 70,
              outline: 'none',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'primary.light',
                opacity: 0.8
              },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px'
              }
            }}
          >
            <Typography variant="h4" sx={{ mb: 0.5, pointerEvents: 'none' }}>
              {option.emoji}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', pointerEvents: 'none' }}>
              {option.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
