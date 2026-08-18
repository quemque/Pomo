import { NextRequest } from 'next/server'
import { addConnection, removeConnection } from '@/lib/sse'

export async function GET(
   req: NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
   const { id } = await params
   const roomId = id

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
