'use client'

import { useTimerStore } from '@/lib/timer-store'
import Link from 'next/link'
import Image from 'next/image'

function formatTime(seconds: number) {
   const m = Math.floor(seconds / 60)
   const s = seconds % 60
   return `${m}:${s.toString().padStart(2, '0')}`
}

export function FloatingTimer() {
   const { timeLeft, totalTime, isRunning, phase, pause, resume } =
      useTimerStore()

   if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      if (pathname === '/room' || pathname.startsWith('/room/')) return null
   }

   if (phase === 'idle') return null

   const progress = ((totalTime - timeLeft) / totalTime) * 100

   return (
      <Link href="/room" className="fixed bottom-6 right-6 z-50">
         <div className="bg-[#4a3f3a] text-[#fdf8f3] rounded-2xl px-5 py-3 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-3">
               <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                     src="/favicon.ico"
                     alt="Pomo"
                     fill
                     className="object-contain"
                  />
               </div>
               <span className="text-xl font-light tabular-nums">
                  {formatTime(timeLeft)}
               </span>
               {isRunning ? (
                  <button
                     onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        pause()
                     }}
                     className="text-sm opacity-70 hover:opacity-100"
                  >
                     ⏸
                  </button>
               ) : (
                  <button
                     onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        resume()
                     }}
                     className="text-sm opacity-70 hover:opacity-100"
                  >
                     ▶
                  </button>
               )}
            </div>

            <div className="mt-2 h-1 bg-[#6b5b4f] rounded-full overflow-hidden">
               <div
                  className="h-full bg-[#b89088] transition-all duration-1000"
                  style={{ width: `${progress}%` }}
               />
            </div>
         </div>
      </Link>
   )
}
