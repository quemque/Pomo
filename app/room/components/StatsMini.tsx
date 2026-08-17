import type { StatsResponse } from '../types'

interface StatsMiniProps {
   stats: StatsResponse | null
   loading: boolean
}

export function StatsMini({ stats, loading }: StatsMiniProps) {
   const statsData = [
      { value: stats?.todaySessions || 0, label: 'Today' },
      { value: stats?.weekSessions || 0, label: 'This week' },
      { value: stats?.streakCount || 0, label: 'Streak' },
   ]

   return (
      <div className="grid grid-cols-3 gap-3 mb-5">
         {statsData.map((stat) => (
            <StatCard key={stat.label} {...stat} loading={loading} />
         ))}
      </div>
   )
}

function StatCard({
   value,
   label,
   loading,
}: {
   value: number
   label: string
   loading: boolean
}) {
   return (
      <div className="bg-white rounded-2xl p-4 text-center border border-[#e8ddd0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
         <div className="text-2xl font-light text-[#6b5b4f] tabular-nums mb-1">
            {loading ? '...' : value}
         </div>
         <div className="text-[10px] text-[#a89a8e] font-medium tracking-[0.1em] uppercase">
            {label}
         </div>
      </div>
   )
}
