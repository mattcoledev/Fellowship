'use server'

import { cookies } from 'next/headers'

export async function verifySitePassword(password: string) {
  const sitePassword = process.env.SITE_PASSWORD
  
  if (!sitePassword) {
    // If no password is set, allow access (for development)
    const cookieStore = await cookies()
    cookieStore.set('site-unlocked', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return { success: true }
  }
  
  if (password === sitePassword) {
    const cookieStore = await cookies()
    cookieStore.set('site-unlocked', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return { success: true }
  }
  
  return { success: false, error: 'Invalid password' }
}
