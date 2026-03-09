import { updateSession } from '@/lib/supabase/proxy'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Check site gate first - every route except /enter and /api/verify-gate must have the cookie
  const siteUnlocked = request.cookies.get('site-unlocked')?.value === 'true'
  const isEnterPage = request.nextUrl.pathname === '/enter'
  const isVerifyGateApi = request.nextUrl.pathname === '/api/verify-gate'
  
  // If site is locked and not on enter page or verify-gate API, redirect to enter
  if (!siteUnlocked && !isEnterPage && !isVerifyGateApi) {
    return NextResponse.redirect(new URL('/enter', request.url))
  }

  // Update the Supabase session
  const response = await updateSession(request)
  
  // Check if user is authenticated for protected routes
  const protectedPaths = ['/room', '/common', '/settings', '/author']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect authenticated users away from auth pages (but not /enter)
  const authPaths = ['/login', '/signup']
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname === path
  )

  if (isAuthPath) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const redirectUrl = new URL('/room', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
