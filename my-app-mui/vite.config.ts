import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Yahoo Finance APIへのプロキシ設定
      '/api/yahoo-finance': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => {
          // /api/yahoo-finance/7203.T?period=1y → /v8/finance/chart/7203.T?range=1y&interval=1d
          const [symbolPart, queryPart] = path.replace('/api/yahoo-finance/', '').split('?')
          const params = new URLSearchParams(queryPart || '')
          const period = params.get('period') || '1y'
          return `/v8/finance/chart/${symbolPart}?range=${period}&interval=1d`
        },
      }
    }
  }
})
