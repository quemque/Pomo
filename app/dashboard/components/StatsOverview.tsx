import type {
   StatsResponse,
   StatsOverviewProps,
   StatCardConfig,
   StatVariant,
} from '../types'
import { STAT_CARDS_CONFIG } from '../constants'

export function StatsOverview({ stats, loading }: StatsOverviewProps) {
   return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {STAT_CARDS_CONFIG.map((config) => (
            <StatCard
               key={config.title}
               config={config}
               stats={stats}
               loading={loading}
            />
         ))}
      </div>
   )
}

function StatCard({
   config,
   stats,
   loading,
}: {
   config: StatCardConfig
   stats: StatsResponse | null
   loading: boolean
}) {
   const value = stats ? config.getValue(stats) : 0
   const subtitle = stats ? config.getSubtitle(stats) : ''
   const styles = getCardStyles(config.variant)

   return (
      <div
         className={`${styles.container} transition-all duration-300 hover:-translate-y-1`}
      >
         <div
            className={`text-3xl font-light mb-2 tabular-nums ${styles.value}`}
         >
            {loading ? '...' : value}
         </div>
         <div
            className={`text-xs font-medium tracking-[0.1em] uppercase ${styles.title}`}
         >
            {config.title}
         </div>
         <div className={`mt-3 text-sm ${styles.subtitle}`}>
            {loading ? '' : subtitle}
         </div>
      </div>
   )
}

function getCardStyles(variant: StatVariant) {
   const styles = {
      primary: {
         container:
            'bg-gradient-to-br from-[#6b5b4f] to-[#8a7a6e] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl',
         value: 'text-white',
         title: 'text-white opacity-80',
         subtitle: 'text-white opacity-90',
      },
      secondary: {
         container:
            'bg-white rounded-2xl p-6 border border-[#e8ddd0] shadow-sm hover:shadow-md',
         value: 'text-[#6b5b4f]',
         title: 'text-[#a89a8e]',
         subtitle: 'text-[#b89088]',
      },
   }
   return styles[variant]
}
