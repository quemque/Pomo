'use client'

import { useEffect, useRef, useState } from 'react'

interface RoomTimerProps {
   roomId: string
   initialPhase: string
   initialEndsAt: string | null
   isOwner: boolean
}

const DURATION_OPTIONS = [
   { label: '15 мин', focus: 15, break: 3 },
   { label: '25 мин', focus: 25, break: 5 },
   { label: '45 мин', focus: 45, break: 10 },
   { label: '60 мин', focus: 60, break: 15 },
]

export function RoomTimer({
   initialPhase,
   initialEndsAt,
   isOwner,
}: RoomTimerProps) {
   const canvasRef = useRef<HTMLCanvasElement>(null)
   const animationRef = useRef<number | undefined>(undefined)
   const containerRef = useRef<HTMLDivElement>(null)

   const [timeLeft, setTimeLeft] = useState(0)
   const [isRunning, setIsRunning] = useState(false)
   const [phase, setPhase] = useState<'focus' | 'break' | 'idle' | 'paused'>(
      initialPhase === 'FOCUS'
         ? 'focus'
         : initialPhase === 'BREAK'
           ? 'break'
           : 'idle',
   )
   const [focusDuration, setFocusDuration] = useState(25)
   const [breakDuration, setBreakDuration] = useState(5)
   const [selectedPreset, setSelectedPreset] = useState(1)
   const [totalTime, setTotalTime] = useState(25 * 60)

   const animStateRef = useRef({ phase, isRunning, timeLeft, totalTime })
   useEffect(() => {
      animStateRef.current = { phase, isRunning, timeLeft, totalTime }
   }, [phase, isRunning, timeLeft, totalTime])

   useEffect(() => {
      if (initialPhase === 'FOCUS' && initialEndsAt) {
         const endsAt = new Date(initialEndsAt).getTime()
         const now = Date.now()
         const secondsLeft = Math.max(0, Math.floor((endsAt - now) / 1000))
         if (secondsLeft > 0) {
            setTimeLeft(secondsLeft)
            setIsRunning(true)
            setTotalTime(focusDuration * 60)
         }
      } else {
         setTimeLeft(focusDuration * 60)
         setTotalTime(focusDuration * 60)
      }
   }, [initialPhase, initialEndsAt, focusDuration])

   useEffect(() => {
      if (!isRunning || timeLeft <= 0) return

      const interval = setInterval(() => {
         setTimeLeft((prev) => {
            if (prev <= 1) {
               setIsRunning(false)
               if (phase === 'focus') {
                  setPhase('break')
                  setTimeLeft(breakDuration * 60)
                  setTotalTime(breakDuration * 60)
                  setIsRunning(true)
                  return breakDuration * 60
               }
               return 0
            }
            return prev - 1
         })
      }, 1000)

      return () => clearInterval(interval)
   }, [isRunning, timeLeft, phase, breakDuration])

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
   }

   useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let width = 0
      let height = 0

      const handleResize = () => {
         const container = containerRef.current
         if (!container) return
         const rect = container.getBoundingClientRect()
         const dpr = window.devicePixelRatio || 1

         width = rect.width || 380
         height = rect.height || 380

         canvas.width = width * dpr
         canvas.height = height * dpr
         canvas.style.width = `${width}px`
         canvas.style.height = `${height}px`

         ctx.scale(dpr, dpr)
      }

      handleResize()
      window.addEventListener('resize', handleResize)

      class PastelParticle {
         x: number = 0
         y: number = 0
         size: number = 0
         angle: number = 0
         speed: number = 0
         distance: number = 0
         maxDistance: number = 0
         phaseAngle: number = 0
         opacity: number = 0
         trail: { x: number; y: number }[] = []

         constructor() {
            this.reset()
         }

         reset() {
            this.x = width / 2
            this.y = height / 2
            this.size = Math.random() * 3 + 1.5
            this.angle = Math.random() * Math.PI * 2
            this.speed = 0.4 + Math.random() * 1.1
            this.distance = Math.random() * 20
            this.maxDistance = 70 + Math.random() * 90
            this.phaseAngle = Math.random() * Math.PI * 2
            this.opacity = 0.3 + Math.random() * 0.4
            this.trail = []
         }

         update(focusFactor: number, progress: number) {
            const currentSpeed =
               this.speed * (0.6 + focusFactor * 0.4) * (0.8 + progress * 0.4)

            this.distance += currentSpeed
            this.angle += 0.008 * focusFactor

            if (this.distance > this.maxDistance) {
               this.reset()
            }

            this.phaseAngle += 0.04 * focusFactor
            const pulse = Math.sin(this.phaseAngle) * 0.4 + 0.6
            const currentSize = this.size * pulse

            const angleOffset = Math.sin(this.distance / 25) * 0.12
            const currentAngle = this.angle + angleOffset

            this.x = width / 2 + Math.cos(currentAngle) * this.distance
            this.y = height / 2 + Math.sin(currentAngle) * this.distance

            this.trail.push({ x: this.x, y: this.y })
            if (this.trail.length > 5) {
               this.trail.shift()
            }

            return currentSize
         }

         draw(
            ctx: CanvasRenderingContext2D,
            baseColor: string,
            currentSize: number,
         ) {
            for (let i = 0; i < this.trail.length - 1; i++) {
               const alpha = (i / this.trail.length) * 0.25 * this.opacity
               ctx.beginPath()
               ctx.arc(
                  this.trail[i].x,
                  this.trail[i].y,
                  currentSize * (i / this.trail.length) * 0.6,
                  0,
                  Math.PI * 2,
               )
               ctx.fillStyle = baseColor.replace('VAR_ALPHA', String(alpha))
               ctx.fill()
            }

            ctx.beginPath()
            ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2)
            ctx.fillStyle = baseColor.replace('VAR_ALPHA', String(this.opacity))
            ctx.fill()

            const glow = ctx.createRadialGradient(
               this.x,
               this.y,
               0,
               this.x,
               this.y,
               currentSize * 2.5,
            )
            glow.addColorStop(0, baseColor.replace('VAR_ALPHA', '0.15'))
            glow.addColorStop(1, baseColor.replace('VAR_ALPHA', '0'))

            ctx.beginPath()
            ctx.arc(this.x, this.y, currentSize * 2.5, 0, Math.PI * 2)
            ctx.fillStyle = glow
            ctx.fill()
         }
      }

      const particles: PastelParticle[] = Array.from(
         { length: 65 },
         () => new PastelParticle(),
      )

      const animate = () => {
         ctx.clearRect(0, 0, width, height)

         const {
            phase: currentPhase,
            timeLeft: time,
            totalTime: total,
         } = animStateRef.current
         const progress = total > 0 ? (total - time) / total : 0
         const isActive = currentPhase !== 'idle'
         const focusFactor = isActive ? 0.6 + progress * 0.4 : 0.15

         let baseColorTemplate = 'rgba(158, 125, 96, VAR_ALPHA)'
         let bgGradientStart = 'rgba(194, 163, 130, 0.06)'

         if (currentPhase === 'focus') {
            baseColorTemplate = 'rgba(99, 136, 114, VAR_ALPHA)'
            bgGradientStart = 'rgba(99, 136, 114, 0.08)'
         } else if (currentPhase === 'break') {
            baseColorTemplate = 'rgba(136, 120, 147, VAR_ALPHA)'
            bgGradientStart = 'rgba(136, 120, 147, 0.08)'
         }

         const gradient = ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            width / 2,
         )
         gradient.addColorStop(0, bgGradientStart)
         gradient.addColorStop(1, 'rgba(253, 248, 243, 0)')

         ctx.fillStyle = gradient
         ctx.fillRect(0, 0, width, height)

         const pulseSize = 35 + progress * 20
         const centerGlow = ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            pulseSize * 2.2,
         )
         centerGlow.addColorStop(
            0,
            baseColorTemplate.replace('VAR_ALPHA', '0.12'),
         )
         centerGlow.addColorStop(1, baseColorTemplate.replace('VAR_ALPHA', '0'))

         ctx.beginPath()
         ctx.arc(width / 2, height / 2, pulseSize * 2.2, 0, Math.PI * 2)
         ctx.fillStyle = centerGlow
         ctx.fill()

         particles.forEach((p) => {
            const size = p.update(focusFactor, progress)
            p.draw(ctx, baseColorTemplate, size)
         })

         animationRef.current = requestAnimationFrame(animate)
      }

      animate()

      return () => {
         window.removeEventListener('resize', handleResize)
         if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
         }
      }
   }, [])

   const handleStart = async () => {
      const seconds = focusDuration * 60
      setTimeLeft(seconds)
      setTotalTime(seconds)
      setPhase('focus')
      setIsRunning(true)
   }

   const handlePause = () => {
      setIsRunning(false)
      setPhase('paused')
   }

   const handleResume = () => {
      setIsRunning(true)
      setPhase('focus')
   }

   const handleStop = () => {
      setIsRunning(false)
      setPhase('idle')
      setTimeLeft(focusDuration * 60)
      setTotalTime(focusDuration * 60)
   }

   const handlePresetChange = (index: number) => {
      setSelectedPreset(index)
      const preset = DURATION_OPTIONS[index]
      setFocusDuration(preset.focus)
      setBreakDuration(preset.break)
      if (phase === 'idle') {
         setTimeLeft(preset.focus * 60)
         setTotalTime(preset.focus * 60)
      }
   }

   const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0
   const circumference = 2 * Math.PI * 96
   const strokeDashoffset = circumference - progress * circumference

   const getPhaseTheme = () => {
      switch (phase) {
         case 'focus':
            return {
               stroke: 'url(#sageGradient)',
               badgeBg: 'bg-[#638872]/10 text-[#4c6d5a] border-[#638872]/20',
               dot: 'bg-[#638872]',
               btnPrimary:
                  'bg-[#5b7d68] hover:bg-[#4d6b58] text-white shadow-lg shadow-[#638872]/25 active:scale-[0.98]',
            }
         case 'break':
            return {
               stroke: 'url(#lavenderGradient)',
               badgeBg: 'bg-[#887893]/10 text-[#6e5d7a] border-[#887893]/20',
               dot: 'bg-[#887893]',
               btnPrimary:
                  'bg-[#7c6c87] hover:bg-[#6a5b74] text-white shadow-lg shadow-[#887893]/25 active:scale-[0.98]',
            }
         default:
            return {
               stroke: 'url(#sandGradient)',
               badgeBg: 'bg-[#9e7d60]/10 text-[#826247] border-[#9e7d60]/20',
               dot: 'bg-[#9e7d60]',
               btnPrimary:
                  'bg-[#5a4d44] hover:bg-[#483d36] text-[#fdf8f3] shadow-lg shadow-[#5a4d44]/20 active:scale-[0.98]',
            }
      }
   }

   const theme = getPhaseTheme()

   return (
      <div className="bg-white/80 border border-[#eee5dc] rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_16px_40px_rgba(180,150,130,0.08)]">
         {isOwner && phase === 'idle' && (
            <div className="flex justify-center items-center p-1 bg-[#f5ede6] rounded-full border border-[#e8dcd0] mb-6 shadow-inner">
               {DURATION_OPTIONS.map((opt, i) => (
                  <button
                     key={opt.label}
                     onClick={() => handlePresetChange(i)}
                     className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                        selectedPreset === i
                           ? 'bg-white text-[#3d322c] shadow-sm font-semibold'
                           : 'text-[#8c7e75] hover:text-[#3d322c]'
                     }`}
                  >
                     {opt.label}
                  </button>
               ))}
            </div>
         )}

         <div
            className="relative w-full max-w-[360px] h-[360px] mx-auto flex items-center justify-center"
            ref={containerRef}
         >
            <canvas
               ref={canvasRef}
               className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded-full"
            />

            <div className="relative w-72 h-72 z-10">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
                  <defs>
                     <linearGradient
                        id="sageGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                     >
                        <stop offset="0%" stopColor="#789a84" />
                        <stop offset="100%" stopColor="#527861" />
                     </linearGradient>
                     <linearGradient
                        id="lavenderGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                     >
                        <stop offset="0%" stopColor="#9d8cb0" />
                        <stop offset="100%" stopColor="#77668a" />
                     </linearGradient>
                     <linearGradient
                        id="sandGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                     >
                        <stop offset="0%" stopColor="#c7a788" />
                        <stop offset="100%" stopColor="#9e7d60" />
                     </linearGradient>
                  </defs>

                  <circle
                     cx="120"
                     cy="120"
                     r="96"
                     fill="none"
                     stroke="#f2e9e1"
                     strokeWidth="5"
                  />

                  <circle
                     cx="120"
                     cy="120"
                     r="96"
                     fill="none"
                     stroke={theme.stroke}
                     strokeWidth="5"
                     strokeLinecap="round"
                     strokeDasharray={circumference}
                     strokeDashoffset={strokeDashoffset}
                     className="transition-all duration-500 ease-out"
                  />
               </svg>

               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                  <div
                     className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase border backdrop-blur-md transition-all duration-300 mb-1 ${theme.badgeBg}`}
                  >
                     <span
                        className={`w-1.5 h-1.5 rounded-full ${theme.dot} ${
                           isRunning ? 'animate-pulse' : ''
                        }`}
                     />
                     {phase === 'focus'
                        ? '🎯 Фокус'
                        : phase === 'break'
                          ? '☕ Перерыв'
                          : '⏸ Готов'}
                  </div>

                  <div className="text-6xl font-light tracking-tight text-[#3d322c] tabular-nums my-1 select-none">
                     {formatTime(timeLeft)}
                  </div>

                  {phase !== 'idle' && (
                     <div className="text-xs font-medium text-[#998b80] mt-1 tracking-wide">
                        {phase === 'focus'
                           ? `${focusDuration} мин сессия`
                           : `${breakDuration} мин отдых`}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {isOwner && (
            <div className="flex justify-center items-center gap-3 mt-6">
               {phase === 'idle' ? (
                  <button
                     onClick={handleStart}
                     className={`w-full max-w-xs py-3.5 px-6 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${theme.btnPrimary}`}
                  >
                     Старт
                  </button>
               ) : phase === 'break' ? (
                  <button
                     onClick={handleStop}
                     className="w-full max-w-xs py-3.5 px-6 bg-[#f0e6dc] hover:bg-[#e4d7c9] text-[#5a4d44] border border-[#e0d2c4] rounded-full font-medium text-sm tracking-wide transition-all duration-300 active:scale-[0.98] shadow-sm"
                  >
                     Завершить
                  </button>
               ) : (
                  <>
                     {isRunning ? (
                        <button
                           onClick={handlePause}
                           className="flex-1 py-3.5 px-5 bg-[#f0e6dc] hover:bg-[#e4d7c9] text-[#5a4d44] border border-[#e0d2c4] rounded-full font-medium text-sm tracking-wide transition-all duration-300 active:scale-[0.98] shadow-sm"
                        >
                           Пауза
                        </button>
                     ) : (
                        <button
                           onClick={handleResume}
                           className={`flex-1 py-3.5 px-5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${theme.btnPrimary}`}
                        >
                           Продолжить
                        </button>
                     )}
                     <button
                        onClick={handleStop}
                        className="px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-full font-medium text-sm tracking-wide transition-all duration-300 active:scale-[0.98] shadow-sm"
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
