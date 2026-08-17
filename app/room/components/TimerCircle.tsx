import { formatTime } from '../utils/formatTime'
import { TIMER_CONSTANTS, PHASE_COLORS } from '../constants'

interface TimerCircleProps {
   timeLeft: number
   totalTime: number
   phase: 'idle' | 'focus' | 'break'
   focusDuration: number
   breakDuration: number
}

export function TimerCircle({
   timeLeft,
   totalTime,
   phase,
   focusDuration,
   breakDuration,
}: TimerCircleProps) {
   const currentTotal =
      totalTime || (phase === 'break' ? breakDuration * 60 : focusDuration * 60)
   const progress = calculateProgress(currentTotal, timeLeft)
   const colors = PHASE_COLORS[phase]

   return (
      <div className="relative w-60 h-60 mx-auto mb-7">
         <TimerSVG progress={progress} color={colors.progress} />
         <TimerDisplay timeLeft={timeLeft} />
      </div>
   )
}

function TimerSVG({ progress, color }: { progress: number; color: string }) {
   const circumference = 2 * Math.PI * TIMER_CONSTANTS.RADIUS
   const strokeDashoffset = circumference - progress * circumference

   return (
      <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
         <circle
            cx="120"
            cy="120"
            r={TIMER_CONSTANTS.RADIUS}
            fill="none"
            stroke="#e8ddd0"
            strokeWidth="6"
            strokeLinecap="round"
         />
         <circle
            cx="120"
            cy="120"
            r={TIMER_CONSTANTS.RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
         />
      </svg>
   )
}

function TimerDisplay({ timeLeft }: { timeLeft: number }) {
   return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
         <div className="text-5xl font-light tracking-wider text-[#6b5b4f] tabular-nums">
            {formatTime(timeLeft)}
         </div>
         <div className="text-[11px] text-[#a89a8e] tracking-[0.1em] uppercase mt-1.5">
            minutes remaining
         </div>
      </div>
   )
}

function calculateProgress(totalTime: number, timeLeft: number): number {
   if (totalTime <= 0) return 0
   return (totalTime - timeLeft) / totalTime
}
