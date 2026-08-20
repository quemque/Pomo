import { BackgroundGlow } from '@/_components/landing/BackgroundGlow'
import TomatoSVG from '@/_components/landing/TomatoSVG'
import Link from 'next/link'

export default function Home() {
   return (
      <main className="fixed inset-0 bg-[#F5F0EB] flex flex-col items-center justify-center overflow-hidden">
         <BackgroundGlow />

         <div className="absolute bottom-[-5vh] md:bottom-[-15vh] left-1/2 -translate-x-1/2 w-[90vw] md:w-[45vw] max-w-[600px] z-0 animate-float pointer-events-none">
            <TomatoSVG />
         </div>

         <h1
            className="relative z-10 text-center text-[28vw] md:text-[22vw] font-black text-white 
               tracking-[-0.04em] leading-none select-none pointer-events-none drop-shadow-2xl"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
         >
            POMO
         </h1>

         <div className="absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 z-20">
            <Link
               href="/room"
               className="group relative flex items-center justify-center gap-3 px-8 py-4 
                          bg-white/40 hover:bg-white/70 backdrop-blur-md 
                          border border-white/50 hover:border-white/90 
                          rounded-full shadow-[0_8px_32px_rgba(139,115,85,0.15)] 
                          transition-all duration-500 ease-out 
                          hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(229,57,53,0.2)]"
            >
               <span className="text-[#5D4037] font-bold tracking-[0.2em] uppercase text-sm">
                  Room
               </span>
               <svg
                  className="w-5 h-5 text-[#E53935] transform group-hover:translate-x-1.5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2.5}
                     d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
               </svg>
            </Link>
         </div>
      </main>
   )
}
