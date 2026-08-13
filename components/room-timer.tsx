'use client'

import { useEffect, useState } from 'react'
import { useTimerStore } from '@/lib/timer-store'

interface RoomTimerProps {
   roomId: string
   initialPhase: string
   initialEndsAt: Date | null
   isOwner: boolean
}

const DURATION_OPTIONS = [
   { label: '15 мин', focus: 15, break: 3 },
   { label: '25 мин', focus: 25, break: 5 },
   { label: '45 мин', focus: 45, break: 10 },
   { label: '60 мин', focus: 60, break: 15 },
]

export function RoomTimer({
   roomId,
   initialPhase,
   initialEndsAt,
   isOwner,
}: RoomTimerProps) {
   const {
      timeLeft,
      isRunning,
      phase,
      start,
      pause,
      resume,
      stop,
      focusDuration,
      breakDuration,
      setDurations,
   } = useTimerStore()
   const [selectedPreset, setSelectedPreset] = useState(1)

   useEffect(() => {
      if (initialPhase === 'FOCUS' && initialEndsAt) {
         const endsAt = new Date(initialEndsAt).getTime()
         const now = Date.now()
         const secondsLeft = Math.max(0, Math.floor((endsAt - now) / 1000))

         if (secondsLeft > 0) {
            start(secondsLeft)
         }
      }
   }, [])

   useEffect(() => {
      if (!isRunning && phase === 'idle') return

      const eventSource = new EventSource(`/api/rooms/${roomId}/events`)

      eventSource.onmessage = (event) => {
         const data = JSON.parse(event.data)

         if (data.type === 'phase_change') {
            const endsAt = new Date(data.endsAt).getTime()
            const now = Date.now()
            const secondsLeft = Math.max(0, Math.floor((endsAt - now) / 1000))

            if (data.phase === 'FOCUS') {
               start(secondsLeft)
            } else if (data.phase === 'BREAK') {
            }
         } else if (data.type === 'pause') {
            pause()
         } else if (data.type === 'resume') {
            resume()
         } else if (data.type === 'stop') {
            stop()
         }
      }

      eventSource.onerror = () => {}

      return () => eventSource.close()
   }, [roomId, start, pause, resume, stop])

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
   }

   const circumference = 2 * Math.PI * 110
   const totalTime = phase === 'focus' ? focusDuration * 60 : breakDuration * 60
   const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0
   const strokeDashoffset = circumference - progress * circumference

   async function handleStart() {
      const seconds = focusDuration * 60
      await fetch(`/api/rooms/${roomId}/start`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ duration: focusDuration }),
      })
      start(seconds)
   }

   async function handlePause() {
      await fetch(`/api/rooms/${roomId}/pause`, { method: 'POST' })
      pause()
   }

   function handlePresetChange(index: number) {
      setSelectedPreset(index)
      const preset = DURATION_OPTIONS[index]
      setDurations(preset.focus, preset.break)
   }

   return (
      <div className="bg-white rounded-2xl border border-[#e8e0d8] p-8">
         {/* Выбор времени */}
         {isOwner && phase === 'idle' && (
            <div className="flex justify-center gap-2 mb-6">
               {DURATION_OPTIONS.map((opt, i) => (
                  <button
                     key={opt.label}
                     onClick={() => handlePresetChange(i)}
                     className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedPreset === i
                           ? 'bg-[#6b5b4f] text-[#fdf8f3]'
                           : 'bg-[#f5ede4] text-[#6b5b4f] border border-[#e8ddd0] hover:bg-[#e8ddd0]'
                     }`}
                  >
                     {opt.label}
                  </button>
               ))}
            </div>
         )}

         {/* Круглый таймер */}
         <div className="relative w-60 h-60 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
               <circle
                  cx="120"
                  cy="120"
                  r="110"
                  fill="none"
                  stroke="#e8ddd0"
                  strokeWidth="6"
               />
               <circle
                  cx="120"
                  cy="120"
                  r="110"
                  fill="none"
                  stroke={phase === 'focus' ? '#b89088' : '#7a9a7a'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
               />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <div className="text-5xl font-light text-[#4a3f3a] tabular-nums">
                  {formatTime(timeLeft)}
               </div>
               <div className="text-xs text-[#a89a8e] uppercase mt-1">
                  {phase === 'focus'
                     ? 'Focus time'
                     : phase === 'break'
                       ? 'Break time'
                       : 'Ready'}
               </div>
               {phase !== 'idle' && (
                  <div className="text-xs text-[#a89a8e] mt-1">
                     {phase === 'focus'
                        ? `${focusDuration} min`
                        : `${breakDuration} min break`}
                  </div>
               )}
            </div>
         </div>

         {/* Кнопки управления */}
         {isOwner && (
            <div className="flex justify-center gap-3">
               {phase === 'idle' ? (
                  <button
                     onClick={handleStart}
                     className="px-7 py-2.5 bg-[#6b5b4f] text-[#fdf8f3] rounded-xl text-sm font-medium hover:bg-[#8a7a6e] transition-colors"
                  >
                     Старт
                  </button>
               ) : phase === 'break' ? (
                  <button
                     onClick={stop}
                     className="px-7 py-2.5 bg-[#f5ede4] text-[#6b5b4f] border border-[#e8ddd0] rounded-xl text-sm font-medium hover:bg-[#e8ddd0] transition-colors"
                  >
                     Завершить
                  </button>
               ) : (
                  <>
                     {isRunning ? (
                        <button
                           onClick={handlePause}
                           className="px-7 py-2.5 bg-[#f5ede4] text-[#6b5b4f] border border-[#e8ddd0] rounded-xl text-sm font-medium hover:bg-[#e8ddd0] transition-colors"
                        >
                           Пауза
                        </button>
                     ) : (
                        <button
                           onClick={() => resume()}
                           className="px-7 py-2.5 bg-[#6b5b4f] text-[#fdf8f3] rounded-xl text-sm font-medium hover:bg-[#8a7a6e] transition-colors"
                        >
                           Продолжить
                        </button>
                     )}
                     <button
                        onClick={() => stop()}
                        className="px-7 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                     >
                        Стоп
                     </button>
                  </>
               )}
            </div>
         )}
      </div>
   )
}
