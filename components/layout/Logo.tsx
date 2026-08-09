import Link from 'next/link'
import Image from 'next/image'

export function Logo() {
   return (
      <Link href="/" className="flex items-center gap-2.5 group">
         <div className="relative w-8 h-8 rounded-xl bg-[#e8d5d0] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Image
               src="/favicon.ico"
               alt="Pomo"
               fill
               className="object-contain"
            />
         </div>
         <span className="text-xl font-light tracking-wide text-[#6b5b4f]">
            pomo
         </span>
      </Link>
   )
}
