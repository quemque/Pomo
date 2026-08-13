'use client'

import { useEffect } from 'react'
import { useTimerStore } from '@/lib/timer-store'

export function RoomTimerSync({ roomId }: { roomId: string }) {
   const { start, pause, stop, setPhase, setTimeLeft } = useTimerStore()

   useEffect(() => {
      const eventSource = new EventSource(`/api/rooms/${roomId}/events`)

      eventSource.onmessage = (event) => {
         const data = JSON.parse(event.data)

         switch (data.type) {
            case 'phase_change':
               const phase = data.phase.toLowerCase() as
                  | 'focus'
                  | 'break'
                  | 'idle'
               setPhase(phase)
               const endsAt = new Date(data.endsAt).getTime()
               const now = Date.now()
               const secondsLeft = Math.max(
                  0,
                  Math.floor((endsAt - now) / 1000),
               )
               setTimeLeft(secondsLeft)
               if (phase === 'focus') {
                  start(secondsLeft)
               } else if (phase === 'break') {
                  useTimerStore.setState({
                     phase: 'break',
                     timeLeft: secondsLeft,
                     totalTime: secondsLeft,
                     isRunning: true,
                  })
               }
               break
            case 'pause':
               pause()
               break
            case 'stop':
               stop()
               break
            case 'user_joined':
               break
         }
      }

      return () => eventSource.close()
   }, [roomId, start, pause, stop, setPhase, setTimeLeft])

   return null
}
