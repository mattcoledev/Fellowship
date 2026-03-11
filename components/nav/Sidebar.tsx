'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  PenLine, 
  Users, 
  MessageCircle,
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { signOut } from '@/lib/auth-actions'

interface SidebarProps {
  username?: string
}

const navItems = [
  { href: '/room', label: 'Your Room', icon: PenLine },
  { href: '/common', label: 'The Common Room', icon: Users },
  { href: '/forum', label: 'The Forum', icon: MessageCircle },
]

export function Sidebar({ username }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const secondaryItems = [
    { href: `/author/${username || 'profile'}`, label: 'Your Profile', icon: User },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-base border-b border-border z-50 flex items-center justify-between px-4">
        <Link href="/room" className="font-serif text-xl text-text-primary">
          The Fellowship
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-raised rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-60 bg-bg-base border-r border-border z-50 flex flex-col",
        "lg:translate-x-0 transition-transform duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand */}
        <div className="p-6 lg:pt-6 pt-20 flex items-center justify-between">
          <Link href="/room" className="font-serif text-2xl text-text-primary">
            The Fellowship
          </Link>
          <div className="hidden lg:block">
            <NotificationBell />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-border" />

        {/* Main nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-accent-subtle text-accent-blue" 
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-raised"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}

          {/* Divider */}
          <div className="!my-4 border-t border-border" />

          {secondaryItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-accent-subtle text-accent-blue" 
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-raised"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom items */}
        <div className="p-4 space-y-1">
          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === '/settings' 
                ? "bg-accent-subtle text-accent-blue" 
                : "text-text-secondary hover:text-text-primary hover:bg-bg-raised"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-text-muted hover:text-text-primary hover:bg-bg-raised"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
