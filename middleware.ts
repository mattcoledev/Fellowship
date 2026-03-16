import { updateSession } from '@/lib/supabase/proxy'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_PATHS = ['/home', '/room', '/common', '/forum', '/settings', '/author', '/admin', '/notifications', '/members']
const AUTH_PATHS = ['/login', '/signup']

function createSupabaseClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {},
      },
    }
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  const isAuthPath = AUTH_PATHS.some(p => pathname === p)

  // Update Supabase session cookies
  const response = await updateSession(request)

  if (isProtected) {
    const supabase = createSupabaseClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check membership status
    const { data: profile } = await supabase
      .from('profiles')
      .select('member_status, is_admin')
      .eq('id', user.id)
      .single()

    if (!profile || profile.member_status !== 'active') {
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }

    // Admin-only routes
    if (pathname.startsWith('/admin') && !profile.is_admin) {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  if (isAuthPath) {
    const supabase = createSupabaseClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
