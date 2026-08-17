import { formatMinutes } from '../utils/format'
import { generateHeatmapData } from '../utils/heatmap'
import type { StatsResponse, HeatmapDay, QuickStatProps } from '../types'
import { HEATMAP_COLORS, HEATMAP_WEEKS } from '../constants'
import type { ActivityHeatmapProps } from '../types'

export function ActivityHeatmap({ stats, loading }: ActivityHeatmapProps) {
   const heatmapData = generateHeatmapData(stats)

   return (
      <div className="bg-white rounded-2xl p-6 border border-[#e8ddd0] shadow-sm">
         <HeatmapHeader />
         <HeatmapGrid data={heatmapData} />
         <HeatmapLegend />
         <QuickStats stats={stats} loading={loading} />
      </div>
   )
}

function HeatmapHeader() {
   return (
      <div className="flex items-center justify-between mb-6">
         <h2 className="text-lg font-medium text-[#6b5b4f]">
            Activity Overview
         </h2>
         <span className="text-xs text-[#a89a8e]">
            Last {HEATMAP_WEEKS} weeks
         </span>
      </div>
   )
}

function HeatmapGrid({ data }: { data: HeatmapDay[][] }) {
   if (!data.length) {
      return (
         <div className="mb-6 text-center py-8 text-[#a89a8e]">
            No activity data yet
         </div>
      )
   }

   return (
      <div className="mb-6">
         <div className="flex gap-1" role="img" aria-label="Activity heatmap">
            {data.map((week, weekIndex) => (
               <HeatmapWeek key={weekIndex} week={week} />
            ))}
         </div>
      </div>
   )
}

function HeatmapWeek({ week }: { week: HeatmapDay[] }) {
   return (
      <div className="flex flex-col gap-1">
         {week.map((day, dayIndex) => (
            <HeatmapCell key={dayIndex} day={day} />
         ))}
      </div>
   )
}

function HeatmapCell({ day }: { day: HeatmapDay }) {
   const isActive = day.intensity > 0
   const tooltip = `${formatDateForTooltip(day.date)}: ${isActive ? `${day.intensity * 2} sessions` : 'No activity'}`

   return (
      <div
         className="w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125"
         style={{
            backgroundColor: HEATMAP_COLORS[day.intensity],
         }}
         title={tooltip}
         role="img"
         aria-label={tooltip}
      />
   )
}

function HeatmapLegend() {
   return (
      <div className="flex items-center justify-end gap-2 mt-3 mb-6">
         <span className="text-xs text-[#a89a8e]">Less</span>
         {HEATMAP_COLORS.map((color, index) => (
            <div
               key={index}
               className="w-3 h-3 rounded-sm"
               style={{ backgroundColor: color }}
               aria-label={`Intensity level ${index}`}
            />
         ))}
         <span className="text-xs text-[#a89a8e]">More</span>
      </div>
   )
}

function QuickStats({
   stats,
   loading,
}: {
   stats: StatsResponse | null
   loading: boolean
}) {
   return (
      <div className="grid grid-cols-2 gap-4">
         <QuickStat
            label="Avg session length"
            value={
               loading ? '...' : formatMinutes(stats?.averageSessionLength || 0)
            }
         />
         <QuickStat
            label="Best day sessions"
            value={loading ? '...' : stats?.bestDay?.sessions || 0}
         />
      </div>
   )
}

function QuickStat({ label, value }: QuickStatProps) {
   return (
      <div className="bg-[#fdf8f3] rounded-xl p-4">
         <div className="text-2xl font-light text-[#6b5b4f] mb-1">{value}</div>
         <div className="text-xs text-[#a89a8e] font-medium">{label}</div>
      </div>
   )
}

function formatDateForTooltip(dateString: string): string {
   if (!dateString) return ''
   const date = new Date(dateString)
   return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
   })
}
