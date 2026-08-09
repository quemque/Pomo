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

         <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">
            <div className="animate-float">
               <svg
                  viewBox="0 0 200 200"
                  className="w-40 h-40 md:w-48 md:h-48 drop-shadow-[0_20px_40px_rgba(229,57,53,0.15)]"
                  aria-hidden="true"
               >
                  <defs>
                     <radialGradient
                        id="notFoundGradient"
                        cx="40%"
                        cy="30%"
                        r="65%"
                     >
                        <stop offset="0%" stopColor="#FF8A8A" />
                        <stop offset="40%" stopColor="#E53935" />
                        <stop offset="100%" stopColor="#8B1818" />
                     </radialGradient>
                     <linearGradient
                        id="leafGradient404"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                     >
                        <stop offset="0%" stopColor="#81C784" />
                        <stop offset="100%" stopColor="#2E7D32" />
                     </linearGradient>
                  </defs>
                  <path
                     d="M100,175 C35,175 10,135 10,95 C10,50 45,30 100,30 C155,30 190,50 190,95 C190,135 165,175 100,175 Z"
                     fill="url(#notFoundGradient)"
                  />
                  <path
                     d="M100,30 C90,15 70,10 55,20 C65,25 80,30 95,35 C97,36 99,35 100,30 Z"
                     fill="url(#leafGradient404)"
                  />
                  <path
                     d="M100,30 C110,15 130,10 145,20 C135,25 120,30 105,35 C103,36 101,35 100,30 Z"
                     fill="url(#leafGradient404)"
                  />
                  <path
                     d="M100,30 C100,15 105,5 110,0 C105,10 100,20 100,30 Z"
                     fill="#1B5E20"
                  />
               </svg>
            </div>

            <h1
               className="text-[20vw] md:text-[15vw] font-black text-white tracking-[-0.04em] leading-none select-none drop-shadow-2xl"
               style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
               404
            </h1>

            <div className="flex flex-col items-center gap-3 -mt-4">
               <p className="text-[#8B7355]/70 text-lg md:text-xl font-light tracking-wide">
                  This pomodoro is overcooked
               </p>
               <p className="text-[#8B7355]/40 text-sm tracking-widest uppercase">
                  Page not found
               </p>
            </div>

            <Link
               href="/"
               className="mt-4 group relative flex items-center justify-center gap-3 px-8 py-4 
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
