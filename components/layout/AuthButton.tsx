'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaUserCircle } from 'react-icons/fa'
import { useSession } from 'next-auth/react'

export function AuthButton() {
   const { data: session } = useSession()

   if (session) {
      return (
         <Link
            href="/profile"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[#6b5b4f] hover:bg-[#f5ede4] transition-all duration-200"
         >
            {session.user?.image ? (
               <Image
                  src={session.user.image}
                  alt="Profile"
                  width={30}
                  height={30}
                  className="rounded-full ring-2 ring-[#e8ddd0] hover:ring-[#b89088] transition-all"
               />
            ) : (
               <FaUserCircle className="w-7 h-7 text-[#a89a8e]" />
            )}
            <span className="text-sm font-light hidden sm:block max-w-[120px] truncate">
               {session.user?.name || 'Profile'}
            </span>
         </Link>
      )
   }

   return (
      <Link
         href="/login"
         className="px-5 py-2 bg-[#6b5b4f] hover:bg-[#8a7a6e] text-[#fdf8f3] text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
      >
         Sign In
      </Link>
   )
}
