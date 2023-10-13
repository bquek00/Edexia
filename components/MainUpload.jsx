"use client";
import { useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import UploadCard from '@/components/Upload'
import { useState } from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer' 
import ResultTable from '@/components/ResultTable'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Loader from './Loader';

export default function MainUpload({session}) {
  const [assignment, setAssignment] = useState(null)
  const [rubric, setRubric] = useState(null)
  const [missing, setMissing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [ready, setReady] = useState(false)
  const [fid, setFid] = useState(null);
  const [message, setMessage] = useState("Missing file upload")
  const supabase = createClientComponentClient()

  useEffect(() => {
    setFid(Math.random())
  }, []);

  async function markTest() {
    console.log("Marking")
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
  //if (file) {
      setAssignment(file);
  //}
}

const handleRubric = (event) => {
  const file = event.target.files[0];
  //if (file) {
      setRubric(file);
  //}
}

const uploadFiles = async () => {
  if (!assignment || !rubric) {
    setMissing(true);
    setMessage("Missing file upload")
    return
  }

  // Upload file here
  console.log(fid)
  const fileExt = assignment.name.split('.').pop()
  const filePath = `${session.user.id}/assignment-${fid}.${fileExt}`

  const rubricExt = rubric.name.split('.').pop()
  const rubricPath = `${session.user.id}/rubric-${fid}.${rubricExt}`

  if (fileExt !== "pdf" || rubricExt !== "pdf") {
    setMissing(true);
    setMessage("Files must be pdf.")
    return
  }

  setMissing(false)
  setLoading(true);
 
  
  let { error: uploadError } = await supabase.storage.from('files').upload(filePath, assignment, {upsert: true})

  if (uploadError) {
    throw uploadError
  }
  
  let { error: rubricError} = await supabase.storage.from('files').upload(rubricPath, rubric, {upsert: true})

  if (rubricError) {
    throw rubricError
  }
  
  markTest();
};

  return (
    <div className={`flex justify-center w-full h-screen items-center bg-gradient-to-r from-violet-950 via-purple-500 to-fuchsia-500
    overflow-y-scroll overflow-x-hidden`}>
      <div className={`${ready ? "hidden": "flex"} flex justify-center w-full h-2/5 lg:h-1/4 items-center space-y-10 lg:space-y-0
      lg:space-x-20 text-white flex-col lg:flex-row`}>
        <UploadCard title="Upload Assignment" onUpload={handleAssignment} loading={loading}/>
        <UploadCard title="Upload Rubric" onUpload={handleRubric} loading={loading}/>
      </div>

      <button 
        className={`${loading || ready ? "hidden": "absolute"} text-start text-white m-1 p-1 border-2 text-lg p-2 hover:bg-black/[.3]
        focus:ring-violet-300 rounded-lg absolute top-mob lg:top-3/4`}
        onClick={uploadFiles}>
            Mark
      </button>

      <p 
        className={`${loading && !ready ? "absolute": "hidden"} text-center lg:text-start text-white m-1 top-1/4`}>
            Marking your assignment. Please do not close the window. 
      </p>
      <div 
        className={`${loading && !ready ? "absolute": "hidden"} text-start text-white m-1 top-1/4 mt-20`}>
           <Loader />
      </div>

      <p className={`${missing && !ready ? "absolute" : "hidden"} font-bold text-white absolute top-basic text-center text-shadow`}>{message}</p>

      {ready && <ResultTable data={results.data}/>}
      
    </div>
  )
}


