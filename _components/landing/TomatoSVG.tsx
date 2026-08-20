export default function TomatoSVG() {
   return (
      <svg
         viewBox="0 0 200 200"
         className="w-full h-full drop-shadow-[0_30px_40px_rgba(229,57,53,0.2)]"
         aria-label="Pomodoro"
      >
         <defs>
            <radialGradient id="tomatoGradient" cx="40%" cy="30%" r="65%">
               <stop offset="0%" stopColor="#FF8A8A" />
               <stop offset="40%" stopColor="#E53935" />
               <stop offset="100%" stopColor="#8B1818" />
            </radialGradient>

            <linearGradient
               id="leafGradient"
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
            fill="url(#tomatoGradient)"
         />

         <path
            d="M100,30 C90,15 70,10 55,20 C65,25 80,30 95,35 C97,36 99,35 100,30 Z"
            fill="url(#leafGradient)"
         />
         <path
            d="M100,30 C110,15 130,10 145,20 C135,25 120,30 105,35 C103,36 101,35 100,30 Z"
            fill="url(#leafGradient)"
         />
         <path
            d="M100,30 C100,15 105,5 110,0 C105,10 100,20 100,30 Z"
            fill="#1B5E20"
         />
      </svg>
   )
}
