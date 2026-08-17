import { create } from 'zustand'

export type Phase = 'idle' | 'focus' | 'break'

interface TimerState {
   timeLeft: number
   totalTime: number
   isRunning: boolean
   phase: Phase
   focusDuration: number
   breakDuration: number
   startedAt: Date | null
   roomId: string | null
   lastSavedAt: number | null
   start: (seconds: number, roomId?: string) => void
   startBreak: (seconds: number) => void
   pause: () => void
   resume: () => void
   stop: () => void
   tick: () => void
   setDurations: (focus: number, breakTime: number) => void
   setPhase: (phase: Phase) => void
   setTimeLeft: (seconds: number) => void
   setTotalTime: (seconds: number) => void
}

let interval: ReturnType<typeof setInterval> | null = null

async function saveSession(
   state: {
      roomId: string | null
      focusDuration: number
      breakDuration: number
      startedAt: Date | null
      totalTime: number
      timeLeft: number
   },
   onSaved?: () => void,
) {
   console.log('saveSession called', state)

   if (!state.startedAt) {
      console.log('No startedAt, skipping')
      return
   }

   const isCompleted = state.timeLeft <= 1
   const actualDuration = isCompleted
      ? state.totalTime
      : state.totalTime - state.timeLeft

   console.log('actualDuration:', actualDuration, 'isCompleted:', isCompleted)

   if (actualDuration < 30) {
      console.log('Duration too short, skipping')
      return
   }

   try {
      const res = await fetch('/api/sessions', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            roomId: state.roomId,
            duration: actualDuration,
            focusTime: state.focusDuration,
            breakTime: state.breakDuration,
            completed: isCompleted,
            startedAt: state.startedAt.toISOString(),
         }),
      })
      console.log('API response:', res.status)
      if (!res.ok) {
         const text = await res.text()
         console.error('API error:', text)
         return
      }
      onSaved?.()
   } catch (e) {
      console.error('Failed to save session:', e)
   }
}

export const useTimerStore = create<TimerState>((set, get) => ({
   timeLeft: 0,
   totalTime: 0,
   isRunning: false,
   phase: 'idle',
   focusDuration: 25,
   breakDuration: 5,
   startedAt: null,
   roomId: null,
   lastSavedAt: null,

   start: (seconds, roomId) => {
      console.log('Timer started:', seconds, roomId)
      set({
         timeLeft: seconds,
         totalTime: seconds,
         isRunning: true,
         phase: 'focus',
         startedAt: new Date(),
         roomId: roomId || null,
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
      const state = get()
      console.log(
         'Timer stop called, phase:',
         state.phase,
         'startedAt:',
         state.startedAt,
      )
      if (state.phase === 'focus' && state.startedAt) {
         saveSession(state, () => set({ lastSavedAt: Date.now() }))
      }
      set({
         timeLeft: 0,
         totalTime: 0,
         isRunning: false,
         phase: 'idle',
         startedAt: null,
         roomId: null,
      })
      if (interval) clearInterval(interval)
   },

   tick: () => {
      const state = get()
      if (!state.isRunning) return

      if (state.timeLeft <= 1) {
         if (state.phase === 'focus') {
            console.log('Focus ended, saving session')
            saveSession({ ...state, timeLeft: 0 }, () =>
               set({ lastSavedAt: Date.now() }),
            )

            const breakSeconds = state.breakDuration * 60
            set({
               timeLeft: breakSeconds,
               totalTime: breakSeconds,
               phase: 'break',
               startedAt: null,
            })
         } else {
            set({
               timeLeft: 0,
               totalTime: 0,
               isRunning: false,
               phase: 'idle',
               startedAt: null,
               roomId: null,
            })
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

   setTotalTime: (seconds) => {
      set({ totalTime: seconds })
   },
}))
