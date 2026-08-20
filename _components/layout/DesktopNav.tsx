'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/constants'

export function DesktopNav() {
   const pathname = usePathname()
   const isActive = (href: string) => pathname === href

   return (
      <nav className="hidden md:flex items-center gap-1">
         {NAV_LINKS.map((link) => (
            <Link
               key={link.href}
               href={link.href}
               className={`relative px-4 py-2 rounded-xl text-sm font-light tracking-wide transition-all duration-200 ${
                  isActive(link.href)
                     ? 'text-[#6b5b4f] bg-[#f5ede4] font-normal'
                     : 'text-[#a89a8e] hover:text-[#6b5b4f] hover:bg-[#f5ede4]/60'
               }`}
            >
               {link.label}
               {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#b89088]" />
               )}
            </Link>
         ))}
      </nav>
   )
}
