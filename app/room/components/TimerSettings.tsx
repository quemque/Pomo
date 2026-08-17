import { useState } from 'react'

interface TimerSettingsProps {
   focusDuration: number
   breakDuration: number
   onAdjust: (type: 'focus' | 'break', delta: number) => void
}

export function TimerSettings({
   focusDuration,
   breakDuration,
   onAdjust,
}: TimerSettingsProps) {
   const [showSettings, setShowSettings] = useState(false)

   return (
      <>
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

               <DurationControl
                  label="Focus duration"
                  value={focusDuration}
                  onDecrease={() => onAdjust('focus', -1)}
                  onIncrease={() => onAdjust('focus', 1)}
               />

               <DurationControl
                  label="Break duration"
                  value={breakDuration}
                  onDecrease={() => onAdjust('break', -1)}
                  onIncrease={() => onAdjust('break', 1)}
               />
            </div>
         </div>
      </>
   )
}

function DurationControl({
   label,
   value,
   onDecrease,
   onIncrease,
}: {
   label: string
   value: number
   onDecrease: () => void
   onIncrease: () => void
}) {
   return (
      <div className="flex items-center justify-between mb-3.5">
         <span className="text-sm text-[#6b5b4f]">{label}</span>
         <div className="flex items-center gap-2.5">
            <AdjustButton onClick={onDecrease}>−</AdjustButton>
            <span className="text-sm font-medium text-[#6b5b4f] w-9 text-center tabular-nums">
               {value} min
            </span>
            <AdjustButton onClick={onIncrease}>+</AdjustButton>
         </div>
      </div>
   )
}

function AdjustButton({
   children,
   onClick,
}: {
   children: React.ReactNode
   onClick: () => void
}) {
   return (
      <button
         onClick={onClick}
         className="w-7 h-7 rounded-lg border border-[#e8ddd0] bg-white text-[#6b5b4f] text-base flex items-center justify-center hover:bg-[#e8ddd0] active:scale-90 transition-all"
      >
         {children}
      </button>
   )
}
