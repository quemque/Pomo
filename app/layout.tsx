import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import './globals.css'
import Header from '@/components/layout/Header'
import { GlobalTicker } from '@/components/global-ticker'
import { FloatingTimer } from '../components/floating-timer'

const geistSans = Geist({
   variable: '--font-geist-sans',
   subsets: ['latin'],
})

const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin'],
})

export const metadata: Metadata = {
   title: 'Pomo',
   description: 'Social pomodoro timer. Focus together, achieve more.',
   openGraph: {
      title: 'Pomo — Focus Together',
      description: 'Join focus rooms, track productivity, build streaks.',
   },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
   return (
      <html
         lang="en"
         className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
         <body className="min-h-full flex flex-col">
            <SessionProvider>
               <Header />
               {children}
               <GlobalTicker />
               <FloatingTimer />
            </SessionProvider>
         </body>
      </html>
   )
}
