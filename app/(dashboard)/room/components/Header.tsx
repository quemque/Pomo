import type { TimerPhase } from '../types'

interface HeaderProps {
   phase: TimerPhase
}

export function Header({ phase }: HeaderProps) {
   const { badgeBg, badgeText, label } = getPhaseStyles(phase)

   return (
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
            {label}
         </span>
      </div>
   )
}

function getPhaseStyles(phase: TimerPhase) {
   const styles = {
      idle: {
         badgeBg: '#e8d5d0',
         badgeText: '#b89088',
         label: 'Ready',
      },
      focus: {
         badgeBg: '#e8d5d0',
         badgeText: '#b89088',
         label: 'Focus time',
      },
      break: {
         badgeBg: '#d4e0d4',
         badgeText: '#7a9a7a',
         label: 'Break time',
      },
   }
   return styles[phase]
}
