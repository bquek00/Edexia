import MainUpload from '@/components/MainUpload'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import NavBar from '@/components/NavBar'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div>
      <NavBar logout={true}/>
    <MainUpload session={session}/>
    </div>
  )
}
