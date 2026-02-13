import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { useState } from 'react'
import { useStockData } from '../hooks/useStockData'

type Period = '30' | '90' | '180' | '365'

const OrkanChart = () => {
  const [period, setPeriod] = useState<Period>('365')
  // トヨタ自動車のティッカーシンボル: 7203.T
  const { data, loading, error } = useStockData('7203.T', Number(period))

  const handlePeriodChange = (_event: React.MouseEvent<HTMLElement>, newPeriod: Period | null) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod)
    }
  }

  // 価格をフォーマット
  const formatPrice = (value: number) => {
    return `¥${value.toLocaleString()}`
  }

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // 統計情報を計算
  const getStats = () => {
    if (!data || data.data.length === 0) return null

    const prices = data.data.map(d => d.price)
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const change = lastPrice - firstPrice
    const changePercent = ((change / firstPrice) * 100).toFixed(2)

    return {
      current: lastPrice,
      change,
      changePercent,
      min: minPrice,
      max: maxPrice
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        データがありません
      </Alert>
    )
  }

  return (
    <Box>
      {/* ヘッダー情報 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {data.name}
        </Typography>
        {stats && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {formatPrice(stats.current)}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: stats.change >= 0 ? 'success.main' : 'error.main',
                mt: 1
              }}
            >
              {stats.change >= 0 ? '+' : ''}
              {formatPrice(stats.change)} ({stats.changePercent}%)
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  最高値
                </Typography>
                <Typography variant="body2">{formatPrice(stats.max)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  最安値
                </Typography>
                <Typography variant="body2">{formatPrice(stats.min)}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* 期間選択 */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          aria-label="chart period"
          size="small"
        >
          <ToggleButton value="30" aria-label="30 days">
            1ヶ月
          </ToggleButton>
          <ToggleButton value="90" aria-label="90 days">
            3ヶ月
          </ToggleButton>
          <ToggleButton value="180" aria-label="180 days">
            6ヶ月
          </ToggleButton>
          <ToggleButton value="365" aria-label="365 days">
            1年
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* チャート */}
      <Paper sx={{ p: 2 }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatPrice}
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value: number) => formatPrice(value)}
              labelFormatter={(label: string) => new Date(label).toLocaleDateString('ja-JP')}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#1976d2"
              strokeWidth={2}
              dot={false}
              name="基準価額"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* 最終更新日時 */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
        最終更新: {new Date(data.lastUpdated).toLocaleString('ja-JP')}
      </Typography>
    </Box>
  )
}

export default OrkanChart
