import { calculateIntensity } from '../../../_lib/format'
import type { StatsResponse, HeatmapDay } from '../types'
import { HEATMAP_WEEKS, DAYS_IN_WEEK } from '../constants'

export function generateHeatmapData(
   stats: StatsResponse | null,
): HeatmapDay[][] {
   if (!stats?.dailyStats?.length) return []

   const today = new Date()
   const intensityMap = createIntensityMap(stats)

   return Array.from({ length: HEATMAP_WEEKS }, (_, weekIndex) => {
      return Array.from({ length: DAYS_IN_WEEK }, (_, dayIndex) => {
         const date = calculateDate(today, weekIndex, dayIndex)
         const dateString = date.toISOString().split('T')[0]

         return {
            date: dateString,
            intensity: intensityMap.get(dateString) || 0,
         }
      })
   })
}

function createIntensityMap(stats: StatsResponse): Map<string, number> {
   const intensityMap = new Map<string, number>()

   stats.dailyStats.forEach((day) => {
      intensityMap.set(day.date, calculateIntensity(day.sessions))
   })

   return intensityMap
}

function calculateDate(today: Date, weekIndex: number, dayIndex: number): Date {
   const date = new Date(today)
   const daysToSubtract =
      weekIndex * DAYS_IN_WEEK + (DAYS_IN_WEEK - 1 - dayIndex)
   date.setDate(date.getDate() - daysToSubtract)
   return date
}
