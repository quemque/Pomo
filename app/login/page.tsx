import { signIn } from '@/auth'

export default function LoginPage() {
   return (
      <form
         action={async () => {
            'use server'
            await signIn('github')
         }}
      >
         <button type="submit">Войти через GitHub</button>
      </form>
   )
}
