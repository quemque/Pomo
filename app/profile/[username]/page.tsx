import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function UserProfilePage({
   params,
}: {
   params: { username: string }
}) {
   const { username } = await params

   const user = await prisma.user.findFirst({
      where: {
         OR: [{ email: username }, { name: username }],
      },
      select: {
         id: true,
         name: true,
         email: true,
         image: true,
         createdAt: true,
         _count: {
            select: {
               focusSessions: true,
               ownedRooms: true,
            },
         },
      },
   })

   if (!user) notFound()

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
                     <p className="text-[#8a7e78] text-sm">
                        Участник с {user.createdAt.toLocaleDateString()}
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f5f0eb] rounded-xl p-4 text-center">
                     <div className="text-2xl font-light text-[#4a3f3a]">
                        {user._count.focusSessions}
                     </div>
                     <div className="text-xs text-[#8a7e78]">Помидоров</div>
                  </div>
                  <div className="bg-[#f5f0eb] rounded-xl p-4 text-center">
                     <div className="text-2xl font-light text-[#4a3f3a]">
                        {user._count.ownedRooms}
                     </div>
                     <div className="text-xs text-[#8a7e78]">Комнат</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
