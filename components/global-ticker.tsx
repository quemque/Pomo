'use client'

import { useEffect } from 'react'
import { useTimerStore } from '@/lib/timer-store'

export function GlobalTicker() {
   useEffect(() => {
      const interval = setInterval(() => {
         useTimerStore.getState().tick()
      }, 1000)

      return () => clearInterval(interval)
   }, [])

   return null
}
