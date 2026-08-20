import { useTimerStore } from '@/lib/timer-store'
import { useCallback } from 'react'

export function useTimer() {
   const {
      timeLeft,
      totalTime,
      isRunning,
      phase,
      focusDuration,
      breakDuration,
      start,
      pause,
      resume,
      stop,
      setDurations,
      setTimeLeft,
      setTotalTime,
   } = useTimerStore()

   const toggle = useCallback(() => {
      if (phase === 'idle') {
         start(focusDuration * 60)
      } else if (isRunning) {
         pause()
      } else {
         resume()
      }
   }, [phase, isRunning, focusDuration, start, pause, resume])

   const reset = useCallback(() => {
      stop()
   }, [stop])

   const adjustDuration = useCallback(
      (type: 'focus' | 'break', delta: number) => {
         if (type === 'focus') {
            const newValue = clamp(focusDuration + delta, 1, 60)
            setDurations(newValue, breakDuration)
            if ((phase === 'focus' || phase === 'idle') && !isRunning) {
               setTimeLeft(newValue * 60)
               setTotalTime(newValue * 60)
            }
         } else {
            const newValue = clamp(breakDuration + delta, 1, 30)
            setDurations(focusDuration, newValue)
            if (phase === 'break' && !isRunning) {
               setTimeLeft(newValue * 60)
               setTotalTime(newValue * 60)
            }
         }
      },
      [
         focusDuration,
         breakDuration,
         phase,
         isRunning,
         setDurations,
         setTimeLeft,
         setTotalTime,
      ],
   )

   return {
      timeLeft,
      totalTime,
      isRunning,
      phase,
      focusDuration,
      breakDuration,
      toggle,
      reset,
      adjustDuration,
   }
}

function clamp(value: number, min: number, max: number): number {
   return Math.max(min, Math.min(max, value))
}
