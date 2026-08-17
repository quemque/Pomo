export const TIMER_CONSTANTS = {
   RADIUS: 110,
   MIN_FOCUS: 1,
   MAX_FOCUS: 60,
   MIN_BREAK: 1,
   MAX_BREAK: 30,
} as const

export const PHASE_COLORS = {
   idle: {
      progress: '#b89088',
      badgeBg: '#e8d5d0',
      badgeText: '#b89088',
      label: 'Ready',
   },
   focus: {
      progress: '#b89088',
      badgeBg: '#e8d5d0',
      badgeText: '#b89088',
      label: 'Focus time',
   },
   break: {
      progress: '#7a9a7a',
      badgeBg: '#d4e0d4',
      badgeText: '#7a9a7a',
      label: 'Break time',
   },
} as const
