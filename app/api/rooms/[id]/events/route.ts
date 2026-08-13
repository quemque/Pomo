import { NextRequest } from 'next/server'
import { addConnection, removeConnection } from '@/lib/sse'

export async function GET(
   req: NextRequest,
   { params }: { params: { id: string } },
) {
   const roomId = params.id

   const stream = new ReadableStream({
      start(controller) {
         addConnection(roomId, controller)

         controller.enqueue(
            `data: ${JSON.stringify({ type: 'connected' })}\n\n`,
         )

         req.signal.addEventListener('abort', () => {
            removeConnection(roomId, controller)
         })
      },
   })

   return new Response(stream, {
      headers: {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         Connection: 'keep-alive',
      },
   })
}
