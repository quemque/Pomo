import { useState, useEffect, useCallback } from 'react'
import type { StatsResponse } from '../types'

export function useRoomStats() {
   const [data, setData] = useState<StatsResponse | null>(null)
   const [loading, setLoading] = useState(true)

   const loadStats = useCallback(async () => {
      try {
         const response = await fetch('/api/sessions/stats')
         const data: StatsResponse = await response.json()
         setData(data)
      } catch (error) {
         console.error('Failed to load stats:', error)
      } finally {
         setLoading(false)
      }
   }, [])

   useEffect(() => {
      Promise.resolve().then(() => {
         loadStats()
      })
   }, [loadStats])

   return { data, loading, refresh: loadStats }
}
