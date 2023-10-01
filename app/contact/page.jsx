import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import BasicCard from '@/components/BasicCard'
import ContactLink from '@/components/ContactLink'

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
      <div className='bg-gradient-to-r from-violet-950 via-purple-500 to-fuchsia-500 h-screen
      flex justify-center items-center'>
        <NavBar logout={user}/>
        <BasicCard 
        title="Contact" 
        left={true}
        image="me.jpeg"
        text="I am a final year computer science student at the University of Queensland and I am passionate about Full Stack Development and creating web applications. This is a Japanese learning app I created for my Japanese elective class I'm doing in university. I also really love Japanese culture and hope to work there one day"
        >
          <ContactLink/>
        </BasicCard>
      </div>
    )
  }