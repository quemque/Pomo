'use server'

import { broadcastToRoom } from '@/lib/sse'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function startRoomTimer(
   roomId: string,
   focusMinutes: number = 25,
   breakMinutes: number = 5,
) {
   if (!roomId) throw new Error('roomId is required')

   const endsAt = new Date(Date.now() + focusMinutes * 60 * 1000)

   const room = await prisma.room.update({
      where: { id: roomId },
      data: {
         currentPhase: 'FOCUS',
         currentPhaseEndsAt: endsAt,
         focusDuration: focusMinutes,
         breakDuration: breakMinutes,
         currentSessionNumber: { increment: 1 },
      },
   })

   broadcastToRoom(roomId, {
      type: 'phase_change',
      phase: 'FOCUS',
      endsAt: room.currentPhaseEndsAt,
      focusDuration: focusMinutes,
      breakDuration: breakMinutes,
   })

   revalidatePath(`/rooms/${roomId}`)
}

export async function pauseRoomTimer(roomId: string) {
   if (!roomId) throw new Error('roomId is required')

   await prisma.room.update({
      where: { id: roomId },
      data: {
         currentPhase: 'PAUSED',
      },
   })

   broadcastToRoom(roomId, {
      type: 'pause',
   })

   revalidatePath(`/rooms/${roomId}`)
}

export async function resumeRoomTimer(roomId: string) {
   if (!roomId) throw new Error('roomId is required')

   const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { currentPhaseEndsAt: true, currentPhase: true },
   })

   if (!room || room.currentPhase !== 'PAUSED') {
      throw new Error('Room not paused')
   }

   await prisma.room.update({
      where: { id: roomId },
      data: {
         currentPhase: 'FOCUS',
      },
   })

   broadcastToRoom(roomId, {
      type: 'resume',
      endsAt: room.currentPhaseEndsAt,
   })

   revalidatePath(`/rooms/${roomId}`)
}

export async function stopRoomTimer(roomId: string) {
   if (!roomId) throw new Error('roomId is required')

   await prisma.room.update({
      where: { id: roomId },
      data: {
         currentPhase: 'IDLE',
         currentPhaseEndsAt: null,
      },
   })

   broadcastToRoom(roomId, {
      type: 'stop',
   })

   revalidatePath(`/rooms/${roomId}`)
}

export async function startBreakTimer(
   roomId: string,
   breakMinutes: number = 5,
) {
   if (!roomId) throw new Error('roomId is required')

   const endsAt = new Date(Date.now() + breakMinutes * 60 * 1000)

   const room = await prisma.room.update({
      where: { id: roomId },
      data: {
         currentPhase: 'BREAK',
         currentPhaseEndsAt: endsAt,
      },
   })

   broadcastToRoom(roomId, {
      type: 'phase_change',
      phase: 'BREAK',
      endsAt: room.currentPhaseEndsAt,
   })

   revalidatePath(`/rooms/${roomId}`)
}

export async function joinRoom(roomId: string, userId: string) {
   const existing = await prisma.roomParticipant.findFirst({
      where: {
         roomId,
         userId,
      },
   })

   if (existing) {
      await prisma.roomParticipant.update({
         where: { id: existing.id },
         data: { leftAt: null },
      })
   } else {
      await prisma.roomParticipant.create({
         data: {
            roomId,
            userId,
         },
      })
   }

   broadcastToRoom(roomId, {
      type: 'user_joined',
      userId,
   })

   revalidatePath(`/rooms/${roomId}`)
}

export async function leaveRoom(roomId: string, userId: string) {
   await prisma.roomParticipant.updateMany({
      where: { roomId, userId },
      data: { leftAt: new Date() },
   })

   broadcastToRoom(roomId, {
      type: 'user_left',
      userId,
   })

   revalidatePath(`/rooms/${roomId}`)
}

export async function createRoom(name: string, ownerId: string) {
   const room = await prisma.room.create({
      data: {
         name,
         ownerId,
      },
   })

   revalidatePath('/rooms')
   return room
}

export async function getRooms() {
   return prisma.room.findMany({
      where: { isPublic: true },
      include: {
         owner: { select: { name: true, image: true } },
         _count: { select: { participants: true } },
      },
      orderBy: { createdAt: 'desc' },
   })
}

export async function getRoom(id: string) {
   return prisma.room.findUnique({
      where: { id },
      include: {
         owner: { select: { name: true, image: true } },
         participants: {
            where: { leftAt: null },
            include: {
               user: { select: { id: true, name: true, image: true } },
            },
         },
      },
   })
}
