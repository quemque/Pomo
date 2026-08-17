import { formatDate, getDayLabel } from '../utils/format'
import type { StatsResponse } from '../types'

interface SessionsChartProps {
   stats: StatsResponse | null
   activeTab: 'week' | 'month'
   onTabChange: (tab: 'week' | 'month') => void
   loading: boolean
}

export function SessionsChart({
   stats,
   activeTab,
   onTabChange,
   loading,
}: SessionsChartProps) {
   const dailyStats = stats?.dailyStats || []
   const maxSessions = Math.max(...dailyStats.map((d) => d.sessions), 1)
   const displayData = dailyStats.slice(0, activeTab === 'week' ? 7 : 30)

   return (
      <div className="bg-white rounded-2xl p-6 border border-[#e8ddd0] shadow-sm">
         <ChartHeader activeTab={activeTab} onTabChange={onTabChange} />

         {displayData.length > 0 ? (
            <BarChart data={displayData} maxSessions={maxSessions} />
         ) : (
            <EmptyState loading={loading} />
         )}
      </div>
   )
}

function ChartHeader({
   activeTab,
   onTabChange,
}: {
   activeTab: 'week' | 'month'
   onTabChange: (tab: 'week' | 'month') => void
}) {
   return (
      <div className="flex items-center justify-between mb-6">
         <h2 className="text-lg font-medium text-[#6b5b4f]">Sessions by Day</h2>
         <div className="flex gap-2">
            <TabButton
               label="Week"
               active={activeTab === 'week'}
               onClick={() => onTabChange('week')}
            />
            <TabButton
               label="Month"
               active={activeTab === 'month'}
               onClick={() => onTabChange('month')}
            />
         </div>
      </div>
   )
}

function TabButton({
   label,
   active,
   onClick,
}: {
   label: string
   active: boolean
   onClick: () => void
}) {
   return (
      <button
         onClick={onClick}
         className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${active ? 'bg-[#6b5b4f] text-white' : 'bg-[#f5ede4] text-[#6b5b4f]'}`}
      >
         {label}
      </button>
   )
}

function BarChart({
   data,
   maxSessions,
}: {
   data: Array<{ date: string; sessions: number }>
   maxSessions: number
}) {
   return (
      <div className="h-64 flex items-end justify-between gap-3">
         {data.map((day, index) => (
            <Bar key={index} day={day} maxSessions={maxSessions} />
         ))}
      </div>
   )
}

function Bar({
   day,
   maxSessions,
}: {
   day: { date: string; sessions: number }
   maxSessions: number
}) {
   return (
      <div className="flex-1 flex flex-col items-center gap-2">
         <div className="text-xs text-[#a89a8e] font-medium tabular-nums">
            {day.sessions}
         </div>
         <div className="w-full flex items-end h-40">
            <div
               className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
               style={{
                  height: `${(day.sessions / maxSessions) * 100}%`,
                  background:
                     day.sessions === maxSessions ? '#b89088' : '#e8ddd0',
                  minHeight: '4px',
               }}
               title={`${formatDate(day.date)}: ${day.sessions} sessions`}
            />
         </div>
         <div className="text-xs text-[#a89a8e]">{getDayLabel(day.date)}</div>
      </div>
   )
}

function EmptyState({ loading }: { loading: boolean }) {
   return (
      <div className="h-64 flex items-center justify-center text-[#a89a8e]">
         {loading
            ? 'Loading...'
            : 'No data yet. Start your first pomodoro session!'}
      </div>
   )
}
