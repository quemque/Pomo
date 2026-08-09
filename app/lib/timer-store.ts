import { create } from 'zustand'

interface TimerState {
   timeLeft: number
   totalTime: number
   isRunning: boolean
   phase: 'idle' | 'focus' | 'break'
   roomId: string | null

   start: (duration: number, roomId?: string) => void
   pause: () => void
   resume: () => void
   stop: () => void
   tick: () => void
   setTimeLeft: (t: number) => void
   setTotalTime: (t: number) => void
   setPhase: (p: 'idle' | 'focus' | 'break') => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
   timeLeft: 25 * 60,
   totalTime: 25 * 60,
   isRunning: false,
   phase: 'idle',
   roomId: null,

   start: (duration, roomId) =>
      set({
         timeLeft: duration,
         totalTime: duration,
         isRunning: true,
         phase: 'focus',
         roomId: roomId || null,
      }),

   pause: () => set({ isRunning: false }),
   resume: () => set({ isRunning: true }),
   stop: () =>
      set({
         isRunning: false,
         phase: 'idle',
         timeLeft: 25 * 60,
         totalTime: 25 * 60,
      }),

   tick: () => {
      const { timeLeft, isRunning } = get()
      if (isRunning && timeLeft > 0) {
         set({ timeLeft: timeLeft - 1 })
      }
   },

   setTimeLeft: (t) => set({ timeLeft: t }),
   setTotalTime: (t) => set({ totalTime: t }),
   setPhase: (p) => set({ phase: p }),
}))
