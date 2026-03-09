import { Sidebar } from '@/components/nav/Sidebar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar />
      {/* Main content area */}
      <main className="lg:pl-60 pt-14 lg:pt-0">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
