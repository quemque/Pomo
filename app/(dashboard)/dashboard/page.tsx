'use client'

import Footer from '@/_components/layout/Footer'
import { useState } from 'react'
import { StatsOverview } from '@/_components/charts/StatsOverview'
import { SessionsChart } from '@/_components/charts/SessionChart'
import { ActivityHeatmap } from '@/_components/charts/ActivityHeatmap'
import { useDashboardStats } from '../../_hooks/useDashboardStats'

export default function DashboardPage() {
   const { stats, loading, refresh } = useDashboardStats()
   const [activeTab, setActiveTab] = useState<'week' | 'month'>('week')

   return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col font-['DM_Sans',sans-serif]">
         <main className="flex-1 px-6 py-8">
            <div className="max-w-6xl mx-auto">
               <DashboardHeader onRefresh={refresh} />
               <StatsOverview stats={stats} loading={loading} />

               <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  <SessionsChart
                     stats={stats}
                     activeTab={activeTab}
                     onTabChange={setActiveTab}
                     loading={loading}
                  />
                  <ActivityHeatmap stats={stats} loading={loading} />
               </div>
            </div>
         </main>
         <Footer />
      </div>
   )
}

function DashboardHeader({ onRefresh }: { onRefresh: () => void }) {
   return (
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-3xl font-light text-[#6b5b4f] mb-1">
               Dashboard
            </h1>
            <p className="text-sm text-[#a89a8e]">Your productivity overview</p>
         </div>
         <RefreshButton onClick={onRefresh} />
      </div>
   )
}

function RefreshButton({ onClick }: { onClick: () => void }) {
   return (
      <button
         onClick={onClick}
         className="px-4 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 bg-white text-[#6b5b4f] border border-[#e8ddd0] hover:bg-[#f5ede4] hover:border-[#ddd0c0]"
      >
         <span className="flex items-center gap-2">
            <RefreshIcon />
            Refresh
         </span>
      </button>
   )
}

function RefreshIcon() {
   return (
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
   )
}
