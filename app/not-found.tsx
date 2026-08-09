import Link from 'next/link'

export default function NotFound() {
   return (
      <main className="fixed inset-0 bg-[#F5F0EB] flex items-center justify-center overflow-hidden">
         <div
            className="absolute top-1/3 left-1/3 w-[40rem] h-[40rem] bg-[#E8DDD4] rounded-full blur-[150px] opacity-40 pointer-events-none"
            aria-hidden="true"
         />
         <div
            className="absolute bottom-1/3 right-1/3 w-[35rem] h-[35rem] bg-[#DDD5CC] rounded-full blur-[130px] opacity-30 pointer-events-none"
            aria-hidden="true"
         />

         <h1
            className="absolute inset-0 flex items-center justify-center text-[30vw] md:text-[22vw] font-black text-white 
                     tracking-[-0.04em] leading-none select-none pointer-events-none drop-shadow-2xl z-0"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
         >
            404
         </h1>

         <div className="relative z-10 flex flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-3">
               <p className="text-[#8B7355]/70 text-lg md:text-xl font-light tracking-wide">
                  This pomodoro is overcooked
               </p>
               <p className="text-[#8B7355]/40 text-sm tracking-widest uppercase">
                  Page not found
               </p>
            </div>

            <Link
               href="/"
               className="group relative flex items-center justify-center gap-3 px-8 py-4 
                        bg-white/40 hover:bg-white/70 backdrop-blur-md 
                        border border-white/50 hover:border-white/90 
                        rounded-full shadow-[0_8px_32px_rgba(139,115,85,0.15)] 
                        transition-all duration-500 ease-out 
                        hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(229,57,53,0.2)]"
            >
               <svg
                  className="w-5 h-5 text-[#E53935] transform group-hover:-translate-x-1.5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2.5}
                     d="M19 12H5m7-7l-7 7 7 7"
                  />
               </svg>
               <span className="text-[#5D4037] font-bold tracking-[0.2em] uppercase text-sm">
                  Go Home
               </span>
            </Link>
         </div>
      </main>
   )
}
