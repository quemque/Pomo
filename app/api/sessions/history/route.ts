import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: Request) {
   const session = await auth()
   if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }

   const { searchParams } = new URL(req.url)
   const days = parseInt(searchParams.get('days') || '7')

   const fromDate = new Date()
   fromDate.setDate(fromDate.getDate() - days)
   const fromDateStr = fromDate.toISOString().split('T')[0]

   const stats = await prisma.dailyPomodoroStats.findMany({
      where: {
         userId: session.user.id,
         date: { gte: fromDateStr },
      },
      orderBy: { date: 'asc' },
   })

   return NextResponse.json(stats)
}
