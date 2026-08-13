import { stopRoomTimer } from '@/app/actions/room'
import { auth } from '@/auth'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function POST(
   req: NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
   const session = await auth()
   if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
   }

   const resolvedParams = await params
   const id = resolvedParams.id

   if (!id) {
      return Response.json({ error: 'Room ID required' }, { status: 400 })
   }

   await stopRoomTimer(id)
   return Response.json({ success: true })
}
