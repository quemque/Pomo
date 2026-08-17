export interface DailyStats {
   date: string
   sessions: number
   totalMinutes: number
   completedSessions: number
   totalFocusMinutes: number
}

export interface StatsResponse {
   totalSessions: number
   todaySessions: number
   weekSessions: number
   streakCount: number
   dailyStats: DailyStats[]
   averageSessionLength: number
   totalMinutes: number
   totalFocusMinutes: number
   totalBreakMinutes: number
   completionRate: number
   completedSessions: number
   interruptedSessions: number
   bestDay: {
      date: string
      sessions: number
   }
}

export interface ActivityHeatmapProps {
   stats: StatsResponse | null
   loading: boolean
}

export interface HeatmapDay {
   date: string
   intensity: number
}
export interface QuickStatProps {
   label: string
   value: string | number
}

export interface StatsOverviewProps {
   stats: StatsResponse | null
   loading: boolean
}

export type StatVariant = 'primary' | 'secondary'

export interface StatCardConfig {
   title: string
   getValue: (stats: StatsResponse) => number
   getSubtitle: (stats: StatsResponse) => string
   variant: StatVariant
}
