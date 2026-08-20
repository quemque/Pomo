import { getRooms } from '@/app/actions/room'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function RoomsPage() {
   const session = await auth()
   if (!session) redirect('/login')

   const rooms = await getRooms()

   return (
      <div className="min-h-screen bg-[#fdf8f3] py-12 px-6">
         <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10">
               <h1 className="text-3xl font-light text-[#4a3f3a]">
                  Комнаты фокуса
               </h1>
               <Link
                  href="/rooms/new"
                  className="px-6 py-2.5 bg-[#6b5b4f] text-[#fdf8f3] rounded-xl text-sm font-medium hover:bg-[#8a7a6e] transition-colors"
               >
                  Создать комнату
               </Link>
            </div>

            {rooms.length === 0 ? (
               <div className="text-center py-20">
                  <div className="text-6xl mb-4">🍅</div>
                  <p className="text-[#8a7e78] text-lg">Пока нет комнат</p>
                  <p className="text-[#a89a8e] text-sm mt-2">Создай первую!</p>
               </div>
            ) : (
               <div className="grid gap-4">
                  {rooms.map((room) => (
                     <Link
                        key={room.id}
                        href={`/rooms/${room.id}`}
                        className="block bg-white rounded-2xl border border-[#e8e0d8] p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
                     >
                        <div className="flex items-center justify-between">
                           <div>
                              <h2 className="text-xl font-light text-[#4a3f3a] mb-1">
                                 {room.name}
                              </h2>
                              <div className="flex items-center gap-4 text-sm text-[#a89a8e]">
                                 <span>
                                    Создатель: {room.owner.name || 'Аноним'}
                                 </span>
                                 <span>•</span>
                                 <span>
                                    {room._count.participants} участников
                                 </span>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <span
                                 className={`w-2.5 h-2.5 rounded-full ${
                                    room.currentPhase === 'FOCUS'
                                       ? 'bg-[#b89088] animate-pulse'
                                       : room.currentPhase === 'BREAK'
                                         ? 'bg-[#7a9a7a]'
                                         : 'bg-[#e8ddd0]'
                                 }`}
                              />
                              <span className="text-sm text-[#8a7e78]">
                                 {room.currentPhase === 'FOCUS'
                                    ? 'Фокус'
                                    : room.currentPhase === 'BREAK'
                                      ? 'Перерыв'
                                      : 'Ожидание'}
                              </span>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            )}
         </div>
      </div>
   )
}
