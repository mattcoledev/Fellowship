import { Sidebar } from '@/components/nav/Sidebar'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let username: string | undefined
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, is_admin')
      .eq('id', user.id)
      .single()
    username = profile?.username
    isAdmin = profile?.is_admin ?? false
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar username={username} isAdmin={isAdmin} />
      {/* Main content area */}
      <main className="lg:pl-60 pt-14 lg:pt-0 pb-16 lg:pb-0">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
