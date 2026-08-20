export function formatTime(seconds: number): string {
   const mins = Math.floor(seconds / 60)
   const secs = seconds % 60
   return `${padZero(mins)}:${padZero(secs)}`
}

function padZero(num: number): string {
   return num.toString().padStart(2, '0')
}
