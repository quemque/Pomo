import { create } from 'zustand'

export type Phase = 'idle' | 'focus' | 'break'

interface TimerState {
   timeLeft: number
   totalTime: number
   isRunning: boolean
   phase: Phase
   focusDuration: number
   breakDuration: number
   start: (seconds: number) => void
   startBreak: (seconds: number) => void
   pause: () => void
   resume: () => void
   stop: () => void
   tick: () => void
   setDurations: (focus: number, breakTime: number) => void
   setPhase: (phase: Phase) => void
   setTimeLeft: (seconds: number) => void
}

let interval: ReturnType<typeof setInterval> | null = null

export const useTimerStore = create<TimerState>((set, get) => ({
   timeLeft: 0,
   totalTime: 0,
   isRunning: false,
   phase: 'idle',
   focusDuration: 25,
   breakDuration: 5,

   start: (seconds) => {
      set({
         timeLeft: seconds,
         totalTime: seconds,
         isRunning: true,
         phase: 'focus',
      })
      if (interval) clearInterval(interval)
      interval = setInterval(() => get().tick(), 1000)
   },

   startBreak: (seconds) => {
      set({
         timeLeft: seconds,
         totalTime: seconds,
         isRunning: true,
         phase: 'break',
      })
      if (interval) clearInterval(interval)
      interval = setInterval(() => get().tick(), 1000)
   },

   pause: () => {
      set({ isRunning: false })
      if (interval) clearInterval(interval)
   },

   resume: () => {
      set({ isRunning: true })
      if (interval) clearInterval(interval)
      interval = setInterval(() => get().tick(), 1000)
   },

   stop: () => {
      set({ timeLeft: 0, totalTime: 0, isRunning: false, phase: 'idle' })
      if (interval) clearInterval(interval)
   },

   tick: () => {
      const state = get()
      if (!state.isRunning) return

      if (state.timeLeft <= 1) {
         if (state.phase === 'focus') {
            const breakSeconds = state.breakDuration * 60
            set({
               timeLeft: breakSeconds,
               totalTime: breakSeconds,
               phase: 'break',
            })
         } else {
            set({ timeLeft: 0, totalTime: 0, isRunning: false, phase: 'idle' })
            if (interval) clearInterval(interval)
         }
         return
      }

      set({ timeLeft: state.timeLeft - 1 })
   },

   setDurations: (focus, breakTime) => {
      set({ focusDuration: focus, breakDuration: breakTime })
   },

   setPhase: (phase) => {
      set({ phase })
   },

   setTimeLeft: (seconds) => {
      set({ timeLeft: seconds })
   },
}))
