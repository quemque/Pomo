export function BackgroundGlow() {
   return (
      <>
         <div
            className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-[#E8DDD4] rounded-full blur-[150px] opacity-60 pointer-events-none"
            aria-hidden="true"
         />
         <div
            className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-[#DDD5CC] rounded-full blur-[130px] opacity-60 pointer-events-none"
            aria-hidden="true"
         />
      </>
   )
}
