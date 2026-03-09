import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const sitePassword = process.env.SITE_PASSWORD
  
  if (!sitePassword || password === sitePassword) {
    const response = NextResponse.json({ success: true })
    
    response.cookies.set('site-unlocked', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    
    return response
  }
  
  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
}
