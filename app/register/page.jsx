"use client";
import Register from './register-form'
import NavBar from '@/components/NavBar';

export default function Home() {


    return (
      <div className='bg-gradient-to-r from-violet-950 via-purple-500 to-fuchsia-500'>
      <NavBar />
      <Register/>
      </div>

    )
  }