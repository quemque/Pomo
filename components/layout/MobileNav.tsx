'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export interface MobileNavProps {
   isOpen: boolean
   onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
   const pathname = usePathname()

   return (
      <nav
         aria-hidden={!isOpen}
         className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-[#e8ddd0]',
            isOpen
               ? 'max-h-64 opacity-100'
               : 'max-h-0 opacity-0 pointer-events-none',
         )}
      >
         <div className="px-6 py-3 space-y-1 bg-[#fdf8f3]/95 backdrop-blur-md">
            {NAV_LINKS.map(({ href, label }) => {
               const isActive = pathname === href

               return (
                  <Link
                     key={href}
                     href={href}
                     onClick={onClose}
                     className={cn(
                        'block px-4 py-2.5 rounded-xl text-sm font-light tracking-wide transition-all',
                        isActive
                           ? 'text-[#6b5b4f] bg-[#f5ede4] font-normal'
                           : 'text-[#a89a8e] hover:text-[#6b5b4f] hover:bg-[#f5ede4]/60',
                     )}
                  >
                     {label}
                  </Link>
               )
            })}
         </div>
      </nav>
   )
}
