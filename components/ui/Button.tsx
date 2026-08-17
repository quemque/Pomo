import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: 'primary' | 'secondary'
   children: ReactNode
}

export function Button({
   variant = 'primary',
   children,
   className = '',
   ...props
}: ButtonProps) {
   const baseStyles =
      'px-7 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200'

   const variants = {
      primary:
         'bg-[#6b5b4f] text-[#fdf8f3] shadow-md hover:bg-[#8a7a6e] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
      secondary:
         'bg-[#f5ede4] text-[#6b5b4f] border border-[#e8ddd0] hover:bg-[#e8ddd0] hover:border-[#ddd0c0]',
   }

   return (
      <button
         className={`${baseStyles} ${variants[variant]} ${className}`}
         {...props}
      >
         {children}
      </button>
   )
}
