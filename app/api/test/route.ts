import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { pdf2json } from 'pdf-parser';

export const dynamic = 'force-dynamic'

async function convertPDFtoJSON(arrayBuffer) {
  return new Promise((resolve, reject) => {
      pdf2json(arrayBuffer, function (error, pdf) {
          if (error) {
              reject(error);
          } else {
              let allText = '';
              pdf.pages.forEach((page) => {
                  const pageText = page.texts.map(text => text.text).join(' ');
                  allText += `Page ${page.pageId}: ${pageText}\n\n`;
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

  const arrayBuffer = await data.arrayBuffer();

  let allText;
  try {
      allText = await convertPDFtoJSON(arrayBuffer);
  } catch (error) {
      console.log(error);
      // Handle error accordingly
      return NextResponse.json({ error: 'Failed to process PDF' });
  }
  console.log(allText)

  return NextResponse.json({ data: {allText}})
}


