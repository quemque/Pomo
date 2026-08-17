import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
   const session = await auth()
   if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }

   const userId = session.user.id
   const today = new Date()
   const todayStr = getDateString(today)
   const weekStartStr = getWeekStartString(today)
   const thirtyDaysAgoStr = getDateString(getDaysAgo(today, 30))

   const [todayStats, weekStats, allSessions, dailyStats, allStats] =
      await Promise.all([
         getTodayStats(userId, todayStr),
         getWeekStats(userId, weekStartStr),
         getAllSessions(userId),
         getDailyStats(userId, thirtyDaysAgoStr),
         getAllDailyStats(userId),
      ])

   const totalSessions = allSessions.length
   const totalFocusSeconds = sumFocusSeconds(allSessions)
   const totalBreakSeconds = sumBreakSeconds(allSessions)
   const completedSessions = countCompletedSessions(allSessions)
   const averageSessionLength = calculateAverageSessionLength(
      totalSessions,
      totalFocusSeconds,
   )
   const completionRate = calculateCompletionRate(
      totalSessions,
      completedSessions,
   )
   const streakCount = calculateStreak(allStats, todayStr)
   const bestDay = findBestDay(dailyStats)
   const formattedDailyStats = formatDailyStats(dailyStats)

   return NextResponse.json({
      totalSessions,
      todaySessions: todayStats?.totalSessions || 0,
      weekSessions: weekStats._sum.totalSessions || 0,
      streakCount,
      dailyStats: formattedDailyStats,
      averageSessionLength,
      totalMinutes: Math.round((totalFocusSeconds + totalBreakSeconds) / 60),
      totalFocusMinutes: Math.round(totalFocusSeconds / 60),
      totalBreakMinutes: Math.round(totalBreakSeconds / 60),
      completionRate,
      bestDay: bestDay
         ? {
              date: bestDay.date,
              sessions: bestDay.totalSessions,
           }
         : { date: '', sessions: 0 },
      completedSessions,
      interruptedSessions: totalSessions - completedSessions,
   })
}

function getDateString(d: Date): string {
   return d.toISOString().split('T')[0]
}

function getWeekStartString(today: Date): string {
   const weekStart = new Date(today)
   weekStart.setDate(today.getDate() - today.getDay() + 1)
   return getDateString(weekStart)
}

function getDaysAgo(today: Date, days: number): Date {
   const date = new Date(today)
   date.setDate(date.getDate() - days)
   return date
}

async function getTodayStats(userId: string, date: string) {
   return prisma.dailyPomodoroStats.findUnique({
      where: {
         userId_date: {
            userId,
            date,
         },
      },
   })
}

async function getWeekStats(userId: string, weekStart: string) {
   return prisma.dailyPomodoroStats.aggregate({
      where: {
         userId,
         date: { gte: weekStart },
      },
      _sum: {
         totalSessions: true,
         completedSessions: true,
         totalFocusSeconds: true,
         totalBreakSeconds: true,
      },
   })
}

async function getAllSessions(userId: string) {
   return prisma.focusSession.findMany({
      where: { userId },
      select: {
         focusTime: true,
         breakTime: true,
         completed: true,
         startedAt: true,
         date: true,
      },
   })
}

async function getDailyStats(userId: string, fromDate: string) {
   return prisma.dailyPomodoroStats.findMany({
      where: {
         userId,
         date: { gte: fromDate },
      },
      orderBy: { date: 'asc' },
      select: {
         date: true,
         totalSessions: true,
         completedSessions: true,
         totalFocusSeconds: true,
         totalBreakSeconds: true,
      },
   })
}

async function getAllDailyStats(userId: string) {
   return prisma.dailyPomodoroStats.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: { date: true, totalSessions: true },
   })
}

function sumFocusSeconds(sessions: Array<{ focusTime: number }>): number {
   return sessions.reduce((acc, s) => acc + s.focusTime, 0)
}

function sumBreakSeconds(sessions: Array<{ breakTime: number }>): number {
   return sessions.reduce((acc, s) => acc + s.breakTime, 0)
}

function countCompletedSessions(
   sessions: Array<{ completed: boolean }>,
): number {
   return sessions.filter((s) => s.completed).length
}

function calculateAverageSessionLength(
   totalSessions: number,
   totalFocusSeconds: number,
): number {
   return totalSessions > 0
      ? Math.round(totalFocusSeconds / totalSessions / 60)
      : 0
}

function calculateCompletionRate(
   totalSessions: number,
   completedSessions: number,
): number {
   return totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0
}

function calculateStreak(
   allStats: Array<{ date: string; totalSessions: number }>,
   todayStr: string,
): number {
   let streakCount = 0
   const todayDate = new Date(todayStr)

   for (let i = 0; i < allStats.length; i++) {
      const expectedDate = new Date(todayDate)
      expectedDate.setDate(expectedDate.getDate() - i)
      const expectedStr = getDateString(expectedDate)

      if (allStats[i]?.date === expectedStr && allStats[i].totalSessions > 0) {
         streakCount++
      } else {
         break
      }
   }

   return streakCount
}

function findBestDay(
   dailyStats: Array<{ date: string; totalSessions: number }>,
) {
   return dailyStats.reduce(
      (best, current) => {
         return current.totalSessions > (best?.totalSessions || 0)
            ? current
            : best
      },
      null as (typeof dailyStats)[0] | null,
   )
}

function formatDailyStats(
   dailyStats: Array<{
      date: string
      totalSessions: number
      completedSessions: number
      totalFocusSeconds: number
      totalBreakSeconds: number
   }>,
) {
   return dailyStats.map((stat) => ({
      date: stat.date,
      sessions: stat.totalSessions,
      totalMinutes: Math.round(
         (stat.totalFocusSeconds + stat.totalBreakSeconds) / 60,
      ),
      completedSessions: stat.completedSessions,
      totalFocusMinutes: Math.round(stat.totalFocusSeconds / 60),
   }))
}
