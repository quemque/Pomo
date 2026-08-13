import { pauseRoomTimer } from '@/app/actions/room'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
   const url = new URL(req.url)
   const pathParts = url.pathname.split('/')
   const id = pathParts[3]

   console.log('Pause route, id:', id)

   if (!id) {
      return Response.json({ error: 'Room ID required' }, { status: 400 })
   }

   await pauseRoomTimer(id)
   return Response.json({ success: true })
}
