'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MyProfilePage() {
   const { data: session, status } = useSession()
   const router = useRouter()

   if (status === 'loading') return <div>Загрузка...</div>
   if (!session?.user) {
      router.push('/login')
      return null
   }

   const user = session.user

   return (
      <div className="min-h-screen bg-[#f5f0eb] py-12 px-6">
         <div className="max-w-2xl mx-auto">
            <Link
               href="/"
               className="text-[#8a7e78] hover:text-[#4a3f3a] text-sm"
            >
               ← Назад
            </Link>

            <div className="bg-white/80 rounded-2xl border border-[#e8e0d8] p-8 mt-6">
               <div className="flex items-center gap-6 mb-8">
                  {user.image ? (
                     <Image
                        src={user.image}
                        alt=""
                        width={96}
                        height={96}
                        className="rounded-full"
                     />
                  ) : (
                     <div className="w-24 h-24 rounded-full bg-[#f5f0eb] flex items-center justify-center text-4xl text-[#b5a89e]">
                        {user.name?.[0] || 'U'}
                     </div>
                  )}
                  <div>
                     <h1 className="text-2xl font-light text-[#4a3f3a]">
                        {user.name}
                     </h1>
                     <p className="text-[#8a7e78] text-sm">{user.email}</p>
                  </div>
               </div>

               <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-lg border border-red-200"
               >
                  Выйти
               </button>
            </div>
         </div>
      </div>
   )
}
