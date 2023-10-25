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
        text="I'm in my final year studying computer science at the University of Queensland, and I have a deep interest in Full Stack Development and web application creation. I developed this automated assignment marking system for a hackathon. Should you come across any issues or have suggestions for enhancement, feel free to reach out!"
        >
          <ContactLink/>
        </BasicCard>
      </div>
    )
  }