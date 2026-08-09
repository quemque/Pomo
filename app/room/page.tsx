'use client'

import Footer from '@/components/layout/Footer'
import { useTimerStore } from '../lib/timer-store'
import { useState, useCallback } from 'react'

export default function Room() {
   const {
      timeLeft,
      totalTime,
      isRunning,
      phase,
      start,
      pause,
      resume,
      stop,
      setTimeLeft,
      setTotalTime,
      setPhase,
   } = useTimerStore()

   const [focusDuration, setFocusDuration] = useState(25)
   const [breakDuration, setBreakDuration] = useState(5)
   const [showSettings, setShowSettings] = useState(false)
   const [sessionsCompleted, setSessionsCompleted] = useState(0)
   const [todayCount, setTodayCount] = useState(0)
   const [weekCount, setWeekCount] = useState(0)
   const [streakCount, setStreakCount] = useState(0)

   const circumference = 2 * Math.PI * 110

   const completePhase = useCallback(() => {
      pause()

      if (phase === 'focus') {
         setTodayCount((p) => p + 1)
         setWeekCount((p) => p + 1)

         const nextSessions = sessionsCompleted + 1
         setSessionsCompleted(nextSessions)

         if (nextSessions >= 4) {
            setStreakCount((p) => p + 1)
            setSessionsCompleted(0)
         }

         setPhase('break')
         setTimeLeft(breakDuration * 60)
         setTotalTime(breakDuration * 60)
      } else {
         setStreakCount((p) => p + 1)
         setPhase('focus')
         setTimeLeft(focusDuration * 60)
         setTotalTime(focusDuration * 60)
      }
   }, [
      phase,
      pause,
      setPhase,
      setTimeLeft,
      setTotalTime,
      breakDuration,
      focusDuration,
      sessionsCompleted,
   ])

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
   }

   const toggleTimer = () => {
      if (phase === 'idle') {
         start(focusDuration * 60)
      } else if (isRunning) {
         pause()
      } else {
         resume()
      }
   }

   const resetTimer = () => stop()

   const adjustDuration = (type: 'focus' | 'break', delta: number) => {
      if (type === 'focus') {
         const newVal = Math.max(1, Math.min(60, focusDuration + delta))
         setFocusDuration(newVal)
         if ((phase === 'focus' || phase === 'idle') && !isRunning) {
            setTimeLeft(newVal * 60)
            setTotalTime(newVal * 60)
         }
      } else {
         const newVal = Math.max(1, Math.min(30, breakDuration + delta))
         setBreakDuration(newVal)
         if (phase === 'break' && !isRunning) {
            setTimeLeft(newVal * 60)
            setTotalTime(newVal * 60)
         }
      }
   }

   if (timeLeft === 0 && isRunning) {
      completePhase()
   }

   const currentTotal =
      totalTime || (phase === 'break' ? breakDuration * 60 : focusDuration * 60)
   const progress =
      currentTotal > 0 ? (currentTotal - timeLeft) / currentTotal : 0
   const strokeDashoffset = circumference - progress * circumference

   const progressColor = phase === 'break' ? '#7a9a7a' : '#b89088'
   const badgeBg = phase === 'break' ? '#d4e0d4' : '#e8d5d0'
   const badgeText = phase === 'break' ? '#7a9a7a' : '#b89088'

   const buttonText = isRunning
      ? phase === 'focus'
         ? 'Pause focus'
         : 'Pause break'
      : phase === 'break'
        ? 'Start break'
        : 'Start focus'

   const badgeLabel =
      phase === 'idle'
         ? 'Ready'
         : phase === 'focus'
           ? 'Focus time'
           : 'Break time'

   return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col font-['DM_Sans',sans-serif]">
         <main className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
               <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium tracking-[0.08em] uppercase text-[#6b5b4f]">
                     Pomo
                  </span>
                  <span
                     className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300"
                     style={{ background: badgeBg, color: badgeText }}
                  >
                     <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: 'currentColor' }}
                     />
                     {badgeLabel}
                  </span>
               </div>

               <div className="relative w-60 h-60 mx-auto mb-7">
                  <svg
                     className="w-full h-full -rotate-90"
                     viewBox="0 0 240 240"
                  >
                     <circle
                        cx="120"
                        cy="120"
                        r="110"
                        fill="none"
                        stroke="#e8ddd0"
                        strokeWidth="6"
                        strokeLinecap="round"
                     />
                     <circle
                        cx="120"
                        cy="120"
                        r="110"
                        fill="none"
                        stroke={progressColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500 ease-out"
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <div className="text-5xl font-light tracking-wider text-[#6b5b4f] tabular-nums">
                        {formatTime(timeLeft)}
                     </div>
                     <div className="text-[11px] text-[#a89a8e] tracking-[0.1em] uppercase mt-1.5">
                        minutes remaining
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-center gap-3 mb-7">
                  <button
                     onClick={toggleTimer}
                     className="px-7 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 bg-[#6b5b4f] text-[#fdf8f3] shadow-md hover:bg-[#8a7a6e] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                  >
                     {buttonText}
                  </button>
                  <button
                     onClick={resetTimer}
                     className="px-7 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 bg-[#f5ede4] text-[#6b5b4f] border border-[#e8ddd0] hover:bg-[#e8ddd0] hover:border-[#ddd0c0]"
                  >
                     Reset
                  </button>
               </div>

               <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center justify-center gap-1.5 w-full mb-4 text-xs text-[#a89a8e] hover:text-[#6b5b4f] transition-colors tracking-wide"
               >
                  <span>Timer settings</span>
                  <svg
                     className={`w-3.5 h-3.5 transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`}
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  >
                     <polyline points="6 9 12 15 18 9" />
                  </svg>
               </button>

               <div
                  className={`overflow-hidden transition-all duration-400 ease-out mb-5 ${showSettings ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
               >
                  <div className="bg-[#f5ede4] rounded-2xl p-5 border border-[#e8ddd0]">
                     <div className="text-xs font-medium text-[#a89a8e] tracking-[0.08em] uppercase mb-4">
                        Adjust durations
                     </div>
                     <div className="flex items-center justify-between mb-3.5">
                        <span className="text-sm text-[#6b5b4f]">
                           Focus duration
                        </span>
                        <div className="flex items-center gap-2.5">
                           <button
                              onClick={() => adjustDuration('focus', -1)}
                              className="w-7 h-7 rounded-lg border border-[#e8ddd0] bg-white text-[#6b5b4f] text-base flex items-center justify-center hover:bg-[#e8ddd0] active:scale-90 transition-all"
                           >
                              −
                           </button>
                           <span className="text-sm font-medium text-[#6b5b4f] w-9 text-center tabular-nums">
                              {focusDuration} min
                           </span>
                           <button
                              onClick={() => adjustDuration('focus', 1)}
                              className="w-7 h-7 rounded-lg border border-[#e8ddd0] bg-white text-[#6b5b4f] text-base flex items-center justify-center hover:bg-[#e8ddd0] active:scale-90 transition-all"
                           >
                              +
                           </button>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b5b4f]">
                           Break duration
                        </span>
                        <div className="flex items-center gap-2.5">
                           <button
                              onClick={() => adjustDuration('break', -1)}
                              className="w-7 h-7 rounded-lg border border-[#e8ddd0] bg-white text-[#6b5b4f] text-base flex items-center justify-center hover:bg-[#e8ddd0] active:scale-90 transition-all"
                           >
                              −
                           </button>
                           <span className="text-sm font-medium text-[#6b5b4f] w-9 text-center tabular-nums">
                              {breakDuration} min
                           </span>
                           <button
                              onClick={() => adjustDuration('break', 1)}
                              className="w-7 h-7 rounded-lg border border-[#e8ddd0] bg-white text-[#6b5b4f] text-base flex items-center justify-center hover:bg-[#e8ddd0] active:scale-90 transition-all"
                           >
                              +
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                     { value: todayCount, label: 'Today' },
                     { value: weekCount, label: 'This week' },
                     { value: streakCount, label: 'Streak' },
                  ].map((stat) => (
                     <div
                        key={stat.label}
                        className="bg-white rounded-2xl p-4 text-center border border-[#e8ddd0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                     >
                        <div className="text-2xl font-light text-[#6b5b4f] tabular-nums mb-1">
                           {stat.value}
                        </div>
                        <div className="text-[10px] text-[#a89a8e] font-medium tracking-[0.1em] uppercase">
                           {stat.label}
                        </div>
                     </div>
                  ))}
               </div>

               <div className="flex justify-center gap-2 mb-6">
                  {[0, 1, 2, 3].map((i) => (
                     <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                           i < sessionsCompleted
                              ? 'bg-[#b89088]'
                              : i === sessionsCompleted &&
                                  phase === 'focus' &&
                                  isRunning
                                ? 'bg-[#b89088] animate-pulse'
                                : 'bg-[#e8ddd0]'
                        }`}
                     />
                  ))}
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
