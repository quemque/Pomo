import { getRoom, joinRoom } from '@/app/actions/room'
import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { RoomTimer } from './_components/room-timer'
import { ShareButton } from './share-button'

export default async function RoomPage({
   params,
}: {
   params: Promise<{ id: string }>
}) {
   const session = await auth()
   const { id } = await params

   if (!id) notFound()

   const room = await getRoom(id)
   if (!room) notFound()

   const userId = session?.user?.id
   const isParticipant = userId
      ? room.participants.some((p) => p.userId === userId && !p.leftAt)
      : false

   const isOwner = userId === room.ownerId

   async function handleJoin() {
      'use server'
      const currentSession = await auth()
      const currentUserId = currentSession?.user?.id

      if (!currentUserId) redirect('/login')

      await joinRoom(id, currentUserId)
      redirect(`/rooms/${id}`)
   }

   return (
      <div className="min-h-screen bg-[#fdf8f3] py-8 px-6">
         <div className="max-w-4xl mx-auto">
            <Link
               href="/rooms"
               className="text-[#8a7e78] hover:text-[#4a3f3a] text-sm"
            >
               ← Комнаты
            </Link>

            <div className="flex items-center justify-between mt-4 mb-8">
               <h1 className="text-2xl font-light text-[#4a3f3a]">
                  {room.name}
               </h1>

               <div className="flex items-center gap-3">
                  <ShareButton roomId={room.id} />

                  {userId && !isParticipant && (
                     <form action={handleJoin}>
                        <button
                           type="submit"
                           className="px-6 py-2.5 bg-[#6b5b4f] text-[#fdf8f3] rounded-xl text-sm font-medium hover:bg-[#8a7a6e] transition-colors"
                        >
                           Присоединиться
                        </button>
                     </form>
                  )}

                  {isParticipant && (
                     <span className="px-4 py-2 bg-[#d4e0d4] text-[#7a9a7a] rounded-xl text-sm">
                        Вы в комнате
                     </span>
                  )}
               </div>
            </div>

            <RoomTimer
               roomId={room.id}
               initialPhase={room.currentPhase}
               initialEndsAt={room.currentPhaseEndsAt?.toISOString() || null}
               isOwner={isOwner}
            />

            <div className="bg-white rounded-2xl border border-[#e8e0d8] p-6 mt-6">
               <h2 className="text-lg font-light text-[#4a3f3a] mb-4">
                  Участники ({room.participants.length})
               </h2>
               <div className="flex gap-3 flex-wrap">
                  {room.participants.map((p) => (
                     <div
                        key={p.id}
                        className="flex items-center gap-2 bg-[#f5f0eb] rounded-xl px-3 py-2"
                     >
                        <div className="w-8 h-8 rounded-full bg-[#b89088] flex items-center justify-center text-white text-xs">
                           {p.user.name?.[0] || 'U'}
                        </div>
                        <span className="text-sm text-[#4a3f3a]">
                           {p.user.name || 'Аноним'}
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   )
}
