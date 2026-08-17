import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function getDateString(d: Date): string {
   return d.toISOString().split('T')[0]
}

export async function POST(req: Request) {
   const session = await auth()
   if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }

   const body = await req.json()
   const now = new Date()
   const dateStr = getDateString(now)

   console.log('Saving session:', body)

   const focusSession = await prisma.focusSession.create({
      data: {
         userId: session.user.id,
         roomId: body.roomId || null,
         duration: body.duration,
         focusTime: body.focusTime,
         breakTime: body.breakTime,
         completed: body.completed ?? true,
         startedAt: new Date(body.startedAt),
         endedAt: now,
         date: dateStr,
      },
   })

   const existing = await prisma.dailyPomodoroStats.findUnique({
      where: {
         userId_date: {
            userId: session.user.id,
            date: dateStr,
         },
      },
   })

   const isRoomSession = !!body.roomId
   const durationSeconds = body.duration

   if (existing) {
      await prisma.dailyPomodoroStats.update({
         where: { id: existing.id },
         data: {
            totalSessions: { increment: 1 },
            completedSessions: body.completed ? { increment: 1 } : undefined,
            interruptedSessions: body.completed ? undefined : { increment: 1 },
            totalFocusSeconds: { increment: durationSeconds },
            longestSession: Math.max(existing.longestSession, durationSeconds),
            avgSessionLength: Math.round(
               (existing.totalFocusSeconds + durationSeconds) /
                  (existing.totalSessions + 1),
            ),
            roomSessions: isRoomSession ? { increment: 1 } : undefined,
            soloSessions: isRoomSession ? undefined : { increment: 1 },
         },
      })
   } else {
      await prisma.dailyPomodoroStats.create({
         data: {
            userId: session.user.id,
            date: dateStr,
            totalSessions: 1,
            completedSessions: body.completed ? 1 : 0,
            interruptedSessions: body.completed ? 0 : 1,
            totalFocusSeconds: durationSeconds,
            longestSession: durationSeconds,
            avgSessionLength: durationSeconds,
            roomSessions: isRoomSession ? 1 : 0,
            soloSessions: isRoomSession ? 0 : 1,
         },
      })
   }

   return NextResponse.json({ success: true, session: focusSession })
}
