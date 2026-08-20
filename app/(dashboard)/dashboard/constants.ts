import type { StatCardConfig } from './types'
import { formatMinutes } from '../../_lib/format'
import { getWeekMessage, getStreakMessage } from '../../_lib/messages'

export const HEATMAP_COLORS = [
   '#f0ebe4',
   '#e8ddd0',
   '#d4c5b5',
   '#b89088',
   '#8a6f64',
] as const

export const HEATMAP_WEEKS = 16
export const DAYS_IN_WEEK = 7

export const HEATMAP_INTENSITY_LEVELS = {
   NONE: 0,
   LOW: 1,
   MEDIUM: 2,
   HIGH: 3,
   VERY_HIGH: 4,
} as const

export const STAT_CARDS_CONFIG: StatCardConfig[] = [
   {
      title: 'Total Sessions',
      getValue: (stats) => stats.totalSessions,
      getSubtitle: (stats) =>
         `${formatMinutes(stats.totalFocusMinutes)} focused`,
      variant: 'primary',
   },
   {
      title: 'Today',
      getValue: (stats) => stats.todaySessions,
      getSubtitle: (stats) =>
         stats.todaySessions > 0 ? 'Keep going!' : 'Start your first session',
      variant: 'secondary',
   },
   {
      title: 'This Week',
      getValue: (stats) => stats.weekSessions,
      getSubtitle: (stats) => getWeekMessage(stats.weekSessions),
      variant: 'secondary',
   },
   {
      title: 'Day Streak',
      getValue: (stats) => stats.streakCount,
      getSubtitle: (stats) => getStreakMessage(stats.streakCount),
      variant: 'secondary',
   },
]
