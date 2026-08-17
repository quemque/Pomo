'use client'

import Footer from '@/components/layout/Footer'
import { TimerCircle } from './components/TimerCircle'
import { TimerControls } from './components/TimerControls'
import { TimerSettings } from './components/TimerSettings'
import { StatsMini } from './components/StatsMini'
import { Header } from './components/Header'
import { useTimer } from './hooks/useTimer'
import { useRoomStats } from './hooks/useRoomStats'

export default function RoomPage() {
   const timer = useTimer()
   const stats = useRoomStats()

   return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col font-['DM_Sans',sans-serif]">
         <main className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
               <Header phase={timer.phase} />

               <TimerCircle
                  timeLeft={timer.timeLeft}
                  totalTime={timer.totalTime}
                  phase={timer.phase}
                  focusDuration={timer.focusDuration}
                  breakDuration={timer.breakDuration}
               />

               <TimerControls
                  isRunning={timer.isRunning}
                  phase={timer.phase}
                  onToggle={timer.toggle}
                  onReset={timer.reset}
               />

               <TimerSettings
                  focusDuration={timer.focusDuration}
                  breakDuration={timer.breakDuration}
                  onAdjust={timer.adjustDuration}
               />

               <StatsMini stats={stats.data} loading={stats.loading} />
            </div>
         </main>
         <Footer />
      </div>
   )
}
