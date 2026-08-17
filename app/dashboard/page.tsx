'use client'

import Footer from '@/components/layout/Footer'
import { useState, useEffect, useCallback } from 'react'

interface DailyStats {
   date: string
   sessions: number
   totalMinutes: number
   completedSessions: number
   totalFocusMinutes: number
}

interface StatsResponse {
   totalSessions: number
   todaySessions: number
   weekSessions: number
   streakCount: number
   dailyStats: DailyStats[]
   averageSessionLength: number
   totalMinutes: number
   totalFocusMinutes: number
   totalBreakMinutes: number
   completionRate: number
   completedSessions: number
   interruptedSessions: number
   bestDay: {
      date: string
      sessions: number
   }
}

export default function DashboardPage() {
   const [stats, setStats] = useState<StatsResponse | null>(null)
   const [statsLoading, setStatsLoading] = useState(true)
   const [activeTab, setActiveTab] = useState<'week' | 'month'>('week')

   const loadStats = useCallback(async () => {
      try {
         const response = await fetch('/api/sessions/stats')
         const data: StatsResponse = await response.json()
         setStats(data)
      } catch (error) {
         console.error('Failed to load stats:', error)
      } finally {
         setStatsLoading(false)
      }
   }, [])

   useEffect(() => {
      // Используем Promise.resolve для избежания синхронного вызова setState
      Promise.resolve().then(() => {
         loadStats()
      })
   }, [loadStats])

   // Построение тепловой карты на основе реальных данных
   const generateHeatmapData = () => {
      if (!stats?.dailyStats?.length) return []

      const today = new Date()
      const weeks = 16
      const heatmapData = []

      // Создаем карту интенсивности из реальных данных
      const intensityMap = new Map()
      stats.dailyStats.forEach((day) => {
         const intensity =
            day.sessions > 8
               ? 4
               : day.sessions > 5
                 ? 3
                 : day.sessions > 3
                   ? 2
                   : day.sessions > 0
                     ? 1
                     : 0
         intensityMap.set(day.date, intensity)
      })

      for (let weekIndex = weeks - 1; weekIndex >= 0; weekIndex--) {
         const week = []
         for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = new Date(today)
            date.setDate(date.getDate() - (weekIndex * 7 + (6 - dayIndex)))
            const dateString = date.toISOString().split('T')[0]
            week.push({
               date: dateString,
               intensity: intensityMap.get(dateString) || 0,
            })
         }
         heatmapData.push(week)
      }
      return heatmapData
   }

   const heatmapData = generateHeatmapData()
   const heatmapColors = ['#f0ebe4', '#e8ddd0', '#d4c5b5', '#b89088', '#8a6f64']

   const dailyStats = stats?.dailyStats || []
   const maxSessions = Math.max(...dailyStats.map((d) => d.sessions), 1)

   const formatMinutes = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = Math.round(minutes % 60)
      if (hours === 0) return `${mins}m`
      return `${hours}h ${mins}m`
   }

   const formatDate = (dateString: string) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
         month: 'short',
         day: 'numeric',
      })
   }

   const getDayLabel = (dateString: string) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { weekday: 'short' })
   }

   return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col font-['DM_Sans',sans-serif]">
         <main className="flex-1 px-6 py-8">
            <div className="max-w-6xl mx-auto">
               {/* Header */}
               <div className="flex items-center justify-between mb-8">
                  <div>
                     <h1 className="text-3xl font-light text-[#6b5b4f] mb-1">
                        Dashboard
                     </h1>
                     <p className="text-sm text-[#a89a8e]">
                        Your productivity overview
                     </p>
                  </div>
                  <button
                     onClick={loadStats}
                     className="px-4 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 bg-white text-[#6b5b4f] border border-[#e8ddd0] hover:bg-[#f5ede4] hover:border-[#ddd0c0]"
                  >
                     <span className="flex items-center gap-2">
                        <svg
                           className="w-4 h-4"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                        >
                           <path d="M23 4v6h-6M1 20v-6h6" />
                           <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        Refresh
                     </span>
                  </button>
               </div>

               {/* Stats Overview */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-[#6b5b4f] to-[#8a7a6e] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                     <div className="text-3xl font-light mb-2 tabular-nums">
                        {statsLoading ? '...' : stats?.totalSessions || 0}
                     </div>
                     <div className="text-xs font-medium tracking-[0.1em] uppercase opacity-80">
                        Total Sessions
                     </div>
                     <div className="mt-3 text-sm opacity-90">
                        {formatMinutes(stats?.totalFocusMinutes || 0)} focused
                     </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-[#e8ddd0] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                     <div className="text-3xl font-light text-[#6b5b4f] mb-2 tabular-nums">
                        {statsLoading ? '...' : stats?.todaySessions || 0}
                     </div>
                     <div className="text-xs font-medium tracking-[0.1em] uppercase text-[#a89a8e]">
                        Today
                     </div>
                     <div className="mt-3 text-sm text-[#b89088]">
                        {(stats?.todaySessions || 0) > 0
                           ? 'Keep going!'
                           : 'Start your first session'}
                     </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-[#e8ddd0] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                     <div className="text-3xl font-light text-[#6b5b4f] mb-2 tabular-nums">
                        {statsLoading ? '...' : stats?.weekSessions || 0}
                     </div>
                     <div className="text-xs font-medium tracking-[0.1em] uppercase text-[#a89a8e]">
                        This Week
                     </div>
                     <div className="mt-3 text-sm text-[#7a9a7a]">
                        {(stats?.weekSessions || 0) > 10
                           ? 'Great week!'
                           : (stats?.weekSessions || 0) > 5
                             ? 'Good progress!'
                             : 'Keep it up!'}
                     </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-[#e8ddd0] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                     <div className="text-3xl font-light text-[#6b5b4f] mb-2 tabular-nums">
                        {statsLoading ? '...' : stats?.streakCount || 0}
                     </div>
                     <div className="text-xs font-medium tracking-[0.1em] uppercase text-[#a89a8e]">
                        Day Streak
                     </div>
                     <div className="mt-3 text-sm text-[#b89088]">
                        🔥{' '}
                        {(stats?.streakCount || 0) > 0
                           ? `${stats?.streakCount} days in a row!`
                           : 'Start your streak today'}
                     </div>
                  </div>
               </div>

               {/* Charts Section */}
               <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  {/* Bar Chart */}
                  <div className="bg-white rounded-2xl p-6 border border-[#e8ddd0] shadow-sm">
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-[#6b5b4f]">
                           Sessions by Day
                        </h2>
                        <div className="flex gap-2">
                           <button
                              onClick={() => setActiveTab('week')}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeTab === 'week' ? 'bg-[#6b5b4f] text-white' : 'bg-[#f5ede4] text-[#6b5b4f]'}`}
                           >
                              Week
                           </button>
                           <button
                              onClick={() => setActiveTab('month')}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeTab === 'month' ? 'bg-[#6b5b4f] text-white' : 'bg-[#f5ede4] text-[#6b5b4f]'}`}
                           >
                              Month
                           </button>
                        </div>
                     </div>
                     {dailyStats.length > 0 ? (
                        <div className="h-64 flex items-end justify-between gap-3">
                           {dailyStats
                              .slice(0, activeTab === 'week' ? 7 : 30)
                              .map((day, index) => (
                                 <div
                                    key={index}
                                    className="flex-1 flex flex-col items-center gap-2"
                                 >
                                    <div className="text-xs text-[#a89a8e] font-medium tabular-nums">
                                       {day.sessions}
                                    </div>
                                    <div className="w-full flex items-end h-40">
                                       <div
                                          className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                                          style={{
                                             height: `${(day.sessions / maxSessions) * 100}%`,
                                             background:
                                                day.sessions === maxSessions
                                                   ? '#b89088'
                                                   : '#e8ddd0',
                                             minHeight: '4px',
                                          }}
                                          title={`${formatDate(day.date)}: ${day.sessions} sessions`}
                                       />
                                    </div>
                                    <div className="text-xs text-[#a89a8e]">
                                       {getDayLabel(day.date)}
                                    </div>
                                 </div>
                              ))}
                        </div>
                     ) : (
                        <div className="h-64 flex items-center justify-center text-[#a89a8e]">
                           {statsLoading
                              ? 'Loading...'
                              : 'No data yet. Start your first pomodoro session!'}
                        </div>
                     )}
                  </div>

                  {/* Activity Overview */}
                  <div className="bg-white rounded-2xl p-6 border border-[#e8ddd0] shadow-sm">
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-[#6b5b4f]">
                           Activity Overview
                        </h2>
                        <span className="text-xs text-[#a89a8e]">
                           Last 16 weeks
                        </span>
                     </div>

                     {/* GitHub-style Heatmap */}
                     <div className="mb-6">
                        <div className="flex gap-1">
                           {heatmapData.map((week, weekIndex) => (
                              <div
                                 key={weekIndex}
                                 className="flex flex-col gap-1"
                              >
                                 {week.map((day, dayIndex) => (
                                    <div
                                       key={dayIndex}
                                       className="w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125"
                                       style={{
                                          backgroundColor:
                                             heatmapColors[day.intensity],
                                       }}
                                       title={`${day.date}: ${day.intensity > 0 ? 'Active' : 'No activity'}`}
                                    />
                                 ))}
                              </div>
                           ))}
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-3">
                           <span className="text-xs text-[#a89a8e]">Less</span>
                           {heatmapColors.map((color, index) => (
                              <div
                                 key={index}
                                 className="w-3 h-3 rounded-sm"
                                 style={{ backgroundColor: color }}
                              />
                           ))}
                           <span className="text-xs text-[#a89a8e]">More</span>
                        </div>
                     </div>

                     {/* Quick Stats */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#fdf8f3] rounded-xl p-4">
                           <div className="text-2xl font-light text-[#6b5b4f] mb-1">
                              {statsLoading
                                 ? '...'
                                 : formatMinutes(
                                      stats?.averageSessionLength || 0,
                                   )}
                           </div>
                           <div className="text-xs text-[#a89a8e] font-medium">
                              Avg session length
                           </div>
                        </div>
                        <div className="bg-[#fdf8f3] rounded-xl p-4">
                           <div className="text-2xl font-light text-[#6b5b4f] mb-1">
                              {statsLoading
                                 ? '...'
                                 : stats?.bestDay?.sessions || 0}
                           </div>
                           <div className="text-xs text-[#a89a8e] font-medium">
                              Best day sessions
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
