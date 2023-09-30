import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { pdf2json } from 'pdf-parser';

export const dynamic = 'force-dynamic'

export async function GET(request) {
  
let t = Math.random()

  return NextResponse.json({ data: {t}});
}


