const roomConnections = new Map<string, Set<ReadableStreamDefaultController>>()

export function addConnection(
   roomId: string,
   controller: ReadableStreamDefaultController,
) {
   if (!roomConnections.has(roomId)) {
      roomConnections.set(roomId, new Set())
   }
   roomConnections.get(roomId)!.add(controller)
}

export function removeConnection(
   roomId: string,
   controller: ReadableStreamDefaultController,
) {
   roomConnections.get(roomId)?.delete(controller)
}

export function broadcastToRoom(roomId: string, data: unknown) {
   const controllers = roomConnections.get(roomId)
   console.log(
      'Broadcast to room:',
      roomId,
      'controllers:',
      controllers?.size,
      'data:',
      data,
   )

   if (!controllers) return

   const message = `data: ${JSON.stringify(data)}\n\n`

   controllers.forEach((controller) => {
      try {
         controller.enqueue(message)
         console.log('Message sent to controller')
      } catch (e) {
         console.log(`Failed to send, removing controller, e: ${e}`)
         controllers.delete(controller)
      }
   })
}
