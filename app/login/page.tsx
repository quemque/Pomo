import { signIn } from '@/auth'

export default function LoginPage() {
   return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0eb]">
         <div className="w-full max-w-sm px-6">
            <div className="text-center mb-12">
               <div className="text-7xl mb-4">🍅</div>
               <h1 className="text-4xl font-light tracking-wider text-[#4a3f3a]">
                  pomo
               </h1>
               <p className="text-[#8a7e78] text-sm mt-2 font-light">
                  focus together
               </p>
            </div>

            <div className="space-y-3">
               <form
                  action={async () => {
                     'use server'
                     await signIn('github', { redirectTo: '/dashboard' })
                  }}
               >
                  <button
                     type="submit"
                     className="w-full px-4 py-4 bg-white hover:bg-[#faf7f4] text-[#4a3f3a] font-light rounded-sm transition-all duration-200 border border-[#e8e0d8] hover:border-[#cbbfb5] active:scale-[0.98] text-sm tracking-wide uppercase"
                  >
                     GitHub
                  </button>
               </form>

               <form
                  action={async () => {
                     'use server'
                     await signIn('google', { redirectTo: '/dashboard' })
                  }}
               >
                  <button
                     type="submit"
                     className="w-full px-4 py-4 bg-white hover:bg-[#faf7f4] text-[#4a3f3a] font-light rounded-sm transition-all duration-200 border border-[#e8e0d8] hover:border-[#cbbfb5] active:scale-[0.98] text-sm tracking-wide uppercase"
                  >
                     Google
                  </button>
               </form>
            </div>

            <div className="relative my-8">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e8e0d8]"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#f5f0eb] text-[#cbbfb5] text-xs tracking-widest uppercase">
                     or
                  </span>
               </div>
            </div>

            <div className="text-center">
               <button className="text-[#8a7e78] hover:text-[#4a3f3a] text-sm font-light transition-colors">
                  continue as guest
               </button>
            </div>

            <p className="text-center text-[#cbbfb5] text-[11px] font-light mt-10 tracking-wide">
               by continuing you agree to our terms
            </p>
         </div>
      </div>
   )
}
