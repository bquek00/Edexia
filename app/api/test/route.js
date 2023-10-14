import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { pdf2json }  from 'pdf-parser';
import OpenAI from 'openai';


export const dynamic = 'force-dynamic'


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API, // defaults to process.env["OPENAI_API_KEY"]
});

async function generateCriteria(criteria) {
	const prompt = `
  Given the marking rubric below that is text extracted form a pdf of a rubric, please extract and structure the criteria and their associated grade descriptions into the following JSON format: [{criteria_name: [{grade: description}]}]. 
  Ignore any data not related to the criteria:
  EXTRACT THE CRITERIA EXACTLY AS PROVIDED.
  MAKE SURE TO EXTRACT ALL CRITERION AND GRADE BANDS.
  DO NOT MAKE ANY CHANGES to the original.
  DO NOT ADD ANY NEW CRITERIA 
  Use the exact same names as the Criteria. DO NOT GIVE ANYTHING EXTRA OR MAKE ANYTHING UP
  ONLY PROVIDE RESPONSE IN THE FOLLOWING JSON format: [{criteria_name: [{grade: description}]}]
  If the given input does not look like a criteria only output null
  Criteria: ${criteria}
      `
   let response = ''
   try {
   const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    temperature: 0.1,
   })
   for await (const part of stream) {
    response += (part.choices[0]?.delta?.content || '');
  } } catch (error) {
    console.log(error)
  }
  return(response)

}


async function generateGrade(criteria, assignment) {
  console.log("loading criteria")
  let rubric= await generateCriteria(criteria);
  if (rubric.trim().toLowerCase() === 'null') {
    return(null)
  }

	const prompt = `
  You are a knowledgeable and thorough teacher, Edexia, who aims to provide strict feedback and insightful evaluations on how students can improve assignments. 
  
  Instructions: 
  How can I improve the given assignment given the criteria
  The goal of this is to help a student improve. Therefore, 
  No matter what grade or how good the assignment is, you must find and give indepth and unique feedback for areas for improvement. 
  You MUST always give tips for improvement no matter what. 
  Your feedback must be thourough and descriptive
  For areas of improvement on each criteria, provided specific examples from the assignments and what should be done to improve. 
  YOUR RESPONSE MUST CONTAIN NOTHING BUT THE EXACT FOLLOWING JSON format: [{each_criteria_name: [{Grade: given_grade, Areas for Improvement: What to improve (MUST HAVE}]}] 
  

  Example:
    [
      {
      "Reflective thinking": [{
        "Grade": "B",
        "Areas for Improvement": "Feedback goes here"
      }]
      }, 
      {
        "Grammar": [{
          "Grade": "C",
          "Areas for Improvement": "Feedback goes here"
        }],
      }
    ]
  
  Keep the criteria format EXACTLY THE SAME with the criteria text provided and DO NOT MAKE ANY CHANGES TO THE CRITERIA STRUCTURE.

  Assignment: ${assignment}

  Here is the Criteria iin the format [{criteria_name: [{grade: description}]}]: ${rubric}
      `
    
    console.log("loading grading")
   let response = ''
   const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    temperature: 0.5,
   })
   for await (const part of stream) {
    response += (part.choices[0]?.delta?.content || '');
  } 
  return(response) 

}

async function convertPDFtoJSON(arrayBuffer) {
  return new Promise((resolve, reject) => {
      pdf2json(arrayBuffer, function (error, pdf) {
          if (error) {
              reject(error);
          } else {
              // Sort pages by pageId to ensure they are in order
              const sortedPages = pdf.pages.sort((a, b) => a.pageId - b.pageId);

              let allText = '';
              sortedPages.forEach((page) => {
                  const pageText = page.texts.map(text => text.text).join(' ');
                  allText += `${pageText}`;
              });
              resolve(allText);
          }
      });
  });
}

export async function GET(request, res) {

  const { searchParams } = new URL(request.url)
  const fid = searchParams.get('fid')

  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data, error } = await supabase
  .storage
  .from('files')
  .download(`${session.user.id}/assignment-${fid}.pdf`)

  const { } = await supabase
  .storage
  .from('files')
  .remove([`${session.user.id}/assignment-${fid}.pdf`])

  const { data: rubric, error: err } = await supabase
  .storage
  .from('files')
  .download(`${session.user.id}/rubric-${fid}.pdf`)

  const { } = await supabase
  .storage
  .from('files')
  .remove([`${session.user.id}/rubric-${fid}.pdf`])

  const arrayBuffer = await data.arrayBuffer();
  const rubricBuffer = await rubric.arrayBuffer();

  let allText;
  let rubricText;

  try {
      allText = await convertPDFtoJSON(arrayBuffer);
  } catch (error) {
      console.log(error);
      // Handle error accordingly
      return NextResponse.json({ error: 'Failed to process PDF' });
  }
  
  try {
      rubricText = await convertPDFtoJSON(rubricBuffer);
  } catch (error) {
      console.log(error);
      // Handle error accordingly
      return NextResponse.json({ error: 'Failed to process PDF' });
  }
 
 const response = await generateGrade(rubricText, allText);

 const obj = JSON.parse(response);
 console.log("done")

  return NextResponse.json({ data: obj})
}


