'use client'

import { useState } from 'react'
import { Logo } from './Logo'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { AuthButton } from './AuthButton'

export default function Header() {
   const [mobileOpen, setMobileOpen] = useState(false)

   return (
      <header className="sticky top-0 z-50 border-b border-[#e8ddd0] bg-[#F5F0EB]">
         <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <Logo />
            <DesktopNav />

            <div className="flex items-center gap-3">
               <AuthButton />

               <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-xl text-[#a89a8e] hover:text-[#6b5b4f] hover:bg-[#f5ede4] transition-all"
                  aria-label="Toggle menu"
               >
                  <svg
                     className="w-5 h-5 transition-transform duration-300"
                     style={{
                        transform: mobileOpen ? 'rotate(90deg)' : 'none',
                     }}
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     viewBox="0 0 24 24"
                  >
                     {mobileOpen ? (
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M6 18L18 6M6 6l12 12"
                        />
                     ) : (
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M4 6h16M4 12h16M4 18h16"
                        />
                     )}
                  </svg>
               </button>
            </div>
         </div>

         <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </header>
   )
}
