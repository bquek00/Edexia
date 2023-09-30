"use client";
import { useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import UploadCard from '@/components/Upload'
import { useState } from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer' 
import ResultTable from '@/components/ResultTable'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function MainUpload({session}) {
  const [assignment, setAssignment] = useState(null)
  const [rubric, setRubric] = useState(null)
  const [missing, setMissing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [ready, setReady] = useState(false)
  const [fid, setFid] = useState(null);
  const supabase = createClientComponentClient()

  useEffect(() => {
    setFid(Math.random())
  }, []);

  async function markTest() {
    try {
      const response = await fetch(`/api/test?fid=${fid}`); // Replace 'your-endpoint' with the actual endpoint URL
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data)
      setResults(data)
      setReady(true)
  
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }


const handleAssignment = (event) => {
  const file = event.target.files[0];
  if (file) {
      setAssignment(file);
  }
}

const handleRubric = (event) => {
  const file = event.target.files[0];
  if (file) {
      setRubric(file);
  }
}

const uploadFiles = async () => {
  if (!assignment || !rubric) {
    setMissing(true);
    return
  }

  setMissing(false)
  setLoading(true);

  // Upload file here
  console.log(fid)
  const fileExt = assignment.name.split('.').pop()
  const filePath = `${session.user.id}/assignment-${fid}.${fileExt}`
 
  
  let { error: uploadError } = await supabase.storage.from('files').upload(filePath, assignment, {upsert: true})

  if (uploadError) {
    throw uploadError
  }

  const rubricExt = rubric.name.split('.').pop()
  const rubricPath = `${session.user.id}/rubric.${rubricExt}`
 
  
  let { error: rubricError} = await supabase.storage.from('files').upload(rubricPath, rubric, {upsert: true})

  if (rubricError) {
    throw rubricError
  }
  
  markTest();
};

  return (
    <div className='flex justify-center w-full h-screen items-center bg-black overflow-y-scroll overflow-x-hidden'>
      <div className={`${ready ? "hidden": "flex"} flex justify-center w-full h-1/4 space-x-20 text-white`}>
        <UploadCard title="Upload Assignment" onUpload={handleAssignment}/>
        <UploadCard title="Upload Rubric" onUpload={handleRubric}/>
      </div>

      <button 
        className={`${loading || ready ? "hidden": "absolute"} text-start text-white m-1 p-1  bg-blue-500 hover:bg-blue-400
        focus:ring-blue-300 rounded-lg absolute top-3/4`}
        onClick={uploadFiles}>
            Mark
      </button>

      <form action="/auth/signout" method="post" className={`${loading || ready ? "hidden": "absolute"} text-start text-white m-1 p-1  bg-blue-500 hover:bg-blue-400
        focus:ring-blue-300 rounded-lg absolute top-3/4 mt-10`}>
      <button  type="submit">
            Sesh: {session?.user.email}
      </button>
                                </form>

      <p 
        className={`${loading && !ready ? "absolute": "hidden"} text-start text-white m-1 top-3/4`}>
            Loading
      </p>

      <p className={`${missing && !ready ? "absolute" : "hidden"} text-rose-600 absolute top-basic`}>Missing file upload</p>

      {ready && <div className='text-white w-full'>{JSON.stringify(results)}</div>}
      
    </div>
  )
}

// {ready && <ResultTable data={results}/>}
