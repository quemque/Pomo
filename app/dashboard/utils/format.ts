export const formatMinutes = (minutes: number): string => {
   const hours = Math.floor(minutes / 60)
   const mins = Math.round(minutes % 60)
   if (hours === 0) return `${mins}m`
   return `${hours}h ${mins}m`
}

export const formatDate = (dateString: string): string => {
   if (!dateString) return ''
   const date = new Date(dateString)
   return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
   })
}

export const getDayLabel = (dateString: string): string => {
   if (!dateString) return ''
   const date = new Date(dateString)
   return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export const calculateIntensity = (sessions: number): number => {
   if (sessions > 8) return 4
   if (sessions > 5) return 3
   if (sessions > 3) return 2
   if (sessions > 0) return 1
   return 0
}
