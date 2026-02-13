import { useState, useEffect } from 'react'
import type { StockData, PriceData } from '../types'

// モックデータを生成する関数
const generateMockData = (days: number): PriceData[] => {
  const data: PriceData[] = []
  const today = new Date()
  let basePrice = 20000 // 基準価額の初期値

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // ランダムな価格変動を追加（±2%程度）
    const change = (Math.random() - 0.5) * 0.04
    basePrice = basePrice * (1 + change)

    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(basePrice)
    })
  }

  return data
}

interface UseStockDataResult {
  data: StockData | null
  loading: boolean
  error: string | null
}

export const useStockData = (
  symbol: string = '7203.T',
  days: number = 365
): UseStockDataResult => {
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Yahoo Finance APIから株価データを取得
        // 期間を計算
        const period = days <= 30 ? '1mo' : days <= 90 ? '3mo' : days <= 180 ? '6mo' : '1y'
        const apiUrl = `/api/yahoo-finance/${symbol}?period=${period}`

        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`Yahoo Finance API Error: ${response.status}`)
        }

        const apiData = await response.json()

        // APIレスポンスの確認
        if (!apiData.chart?.result?.[0]) {
          throw new Error('データの取得に失敗しました')
        }

        const result = apiData.chart.result[0]
        const timestamps = result.timestamp || []
        const quotes = result.indicators?.quote?.[0] || {}
        const closes = quotes.close || []

        // データを変換
        const priceData: PriceData[] = timestamps
          .map((timestamp: number, index: number) => {
            const price = closes[index]
            if (price === null || price === undefined) return null

            const date = new Date(timestamp * 1000)
            return {
              date: date.toISOString().split('T')[0],
              price: Math.round(price * 100) / 100 // 小数点2桁
            }
          })
          .filter((item): item is PriceData => item !== null)

        const stockData: StockData = {
          name: result.meta?.longName || result.meta?.shortName || symbol,
          symbol: symbol,
          data: priceData,
          lastUpdated: new Date().toISOString()
        }

        setData(stockData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [symbol, days])

  return { data, loading, error }
}
