'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

export function ShareButton({ roomId }: { roomId: string }) {
   const [copied, setCopied] = useState(false)

   async function handleCopy() {
      const url = `${window.location.origin}/rooms/${roomId}`
      try {
         await navigator.clipboard.writeText(url)
         setCopied(true)
         setTimeout(() => setCopied(false), 2000)
      } catch {
         const input = document.createElement('input')
         input.value = url
         document.body.appendChild(input)
         input.select()
         document.execCommand('copy')
         document.body.removeChild(input)
         setCopied(true)
         setTimeout(() => setCopied(false), 2000)
      }
   }

   return (
      <button
         onClick={handleCopy}
         className="flex items-center gap-2 px-4 py-2.5 bg-[#f5ede4] text-[#6b5b4f] border border-[#e8ddd0] rounded-xl text-sm font-medium hover:bg-[#e8ddd0] transition-colors"
      >
         {copied ? (
            <>
               <Check className="w-4 h-4" />
               Скопировано!
            </>
         ) : (
            <>
               <Share2 className="w-4 h-4" />
               Поделиться
            </>
         )}
      </button>
   )
}
