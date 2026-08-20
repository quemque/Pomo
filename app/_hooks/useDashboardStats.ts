import { useState, useEffect, useCallback } from 'react'
import type { StatsResponse } from '../(dashboard)/dashboard/types'

export function useDashboardStats() {
   const [stats, setStats] = useState<StatsResponse | null>(null)
   const [loading, setLoading] = useState(true)

   const refresh = useCallback(async () => {
      try {
         setLoading(true)
         const response = await fetch('/api/sessions/stats')
         const data: StatsResponse = await response.json()
         setStats(data)
      } catch (error) {
         console.error('Failed to load stats:', error)
      } finally {
         setLoading(false)
      }
   }, [])

   useEffect(() => {
      Promise.resolve().then(refresh)
   }, [refresh])

   return { stats, loading, refresh }
}
