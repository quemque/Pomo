export function getWeekMessage(sessions: number): string {
   if (sessions > 10) return 'Great week!'
   if (sessions > 5) return 'Good progress!'
   if (sessions > 0) return 'Keep it up!'
   return 'No sessions yet'
}

export function getStreakMessage(streak: number): string {
   if (streak === 0) return 'Start your streak today'
   if (streak === 1) return '🔥 1 day streak!'
   return `🔥 ${streak} days in a row!`
}
