import { Button } from '@/components/ui/Button'
import type { TimerPhase } from '../types'

interface TimerControlsProps {
   isRunning: boolean
   phase: TimerPhase
   onToggle: () => void
   onReset: () => void
}

export function TimerControls({
   isRunning,
   phase,
   onToggle,
   onReset,
}: TimerControlsProps) {
   const buttonText = getButtonText(isRunning, phase)

   return (
      <div className="flex items-center justify-center gap-3 mb-7">
         <Button onClick={onToggle}>{buttonText}</Button>
         <Button variant="secondary" onClick={onReset}>
            Reset
         </Button>
      </div>
   )
}

function getButtonText(isRunning: boolean, phase: TimerPhase): string {
   if (isRunning) {
      return phase === 'focus' ? 'Pause focus' : 'Pause break'
   }
   if (phase === 'break') return 'Resume break'
   if (phase === 'focus') return 'Resume focus'
   return 'Start focus'
}
