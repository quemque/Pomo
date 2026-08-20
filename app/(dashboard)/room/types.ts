export type TimerPhase = 'idle' | 'focus' | 'break'

export interface StatsResponse {
   totalSessions: number
   todaySessions: number
   weekSessions: number
   streakCount: number
}
