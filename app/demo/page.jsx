import NavBar from '@/components/NavBar'
import GetStarted from '@/components/GetStarted'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'


export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let user = false;
  if (session) {
    user = true;
  } 
  

    return (
      <div className='bg-gradient-to-r from-violet-950 via-purple-500 to-fuchsia-500'>
        <NavBar logout={user}/>
        <div className='h-screen flex justify-center gap-10 lg:justify-around items-center px-10 lg:px-20 flex-col lg:flex-row'>

        <GetStarted title="Automated assignment marking" text="Mark your assignment in less than a minute using Edexia's powerful AI"/>

        <iframe className='rounded-2xl border-4 border-purple-900 video-frame'
          src="https://www.youtube.com/embed/jbcZ66a1h30?si=QzVjaonrll_80k2I" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen>
          
        </iframe>

        </div>
        
      </div>
    )
  }