import { Card, CardContent, Typography } from '@mui/material'

export default function EmptyState() {
  return (
    <Card sx={{ mt: 4, textAlign: 'center', py: 6 }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          まだ日記がありません
        </Typography>
        <Typography variant="body2" color="text.secondary">
          右下の＋ボタンから新しい日記を書き始めましょう
        </Typography>
      </CardContent>
    </Card>
  )
}
