import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and the current path is / redirect the user to /account
  if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== '/register' && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/contact' && req.nextUrl.pathname !== '/demo') {
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/demo', req.url))
    } else {
    return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  await supabase.auth.getSession()
  return res
}

export const config = {
  matcher: ['/', '/login', '/register', '/contact', '/demo'],
}