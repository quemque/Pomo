import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
   const { pathname } = req.nextUrl

   const protectedPaths = ['/dashboard', '/profile', '/settings']

   if (protectedPaths.some((p) => pathname.startsWith(p)) && !req.auth) {
      return NextResponse.redirect(new URL('/login', req.url))
   }

   return NextResponse.next()
})

export const config = {
   matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'],
}
