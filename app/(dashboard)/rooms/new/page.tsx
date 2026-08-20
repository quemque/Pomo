import { createRoom } from '@/app/actions/room'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewRoomPage() {
   const session = await auth()

   if (!session?.user?.email) redirect('/login')

   async function handleCreate(formData: FormData) {
      'use server'

      const name = formData.get('name') as string

      const userId = formData.get('userId') as string

      const room = await createRoom(name, userId)

      redirect(`/rooms/${room.id}`)
   }

   return (
      <div className="min-h-screen bg-[#fdf8f3] py-12 px-6">
         <div className="max-w-md mx-auto">
            <Link
               href="/rooms"
               className="text-[#8a7e78] hover:text-[#4a3f3a] text-sm mb-6 inline-block"
            >
               ← Назад к комнатам
            </Link>

            <h1 className="text-2xl font-light text-[#4a3f3a] mb-8">
               Создать комнату
            </h1>

            <form action={handleCreate} className="space-y-4">
               {/* Скрытое поле с userId */}
               <input type="hidden" name="userId" value={session.user.id} />

               <div>
                  <label className="block text-sm text-[#6b5b4f] mb-2">
                     Название
                  </label>
                  <input
                     name="name"
                     type="text"
                     required
                     placeholder="Например: Утренний фокус"
                     className="w-full px-4 py-3 bg-white border border-[#e8e0d8] rounded-xl text-[#4a3f3a] placeholder:text-[#a89a8e] focus:outline-none focus:border-[#b89088] transition-colors"
                  />
               </div>

               <button
                  type="submit"
                  className="w-full py-3 bg-[#6b5b4f] text-[#fdf8f3] rounded-xl font-medium hover:bg-[#8a7a6e] transition-colors"
               >
                  Создать и войти
               </button>
            </form>
         </div>
      </div>
   )
}
