'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  PenLine,
  Users,
  MessageCircle,
  Contact,
  User,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { signOut } from '@/lib/auth-actions'
import { NotificationBell } from '@/components/notifications/NotificationBell'

interface SidebarProps {
  username?: string
  isAdmin?: boolean
}

const navItems = [
  { href: '/home',    label: 'Home',             mobileLabel: 'Home',       icon: Home },
  { href: '/room',    label: 'Your Room',         mobileLabel: 'Room',       icon: PenLine },
  { href: '/common',  label: 'The Common Room',   mobileLabel: 'Writing',    icon: Users },
  { href: '/forum',   label: 'The Roundtable',    mobileLabel: 'Roundtable', icon: MessageCircle },
  { href: '/members', label: 'Members',           mobileLabel: 'Members',    icon: Contact },
]

export function Sidebar({ username, isAdmin }: SidebarProps) {
  const pathname = usePathname()

  const handleSignOut = async () => { await signOut() }

  return (
    <>
      {/* Mobile top header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-base border-b border-border z-50 flex items-center justify-between px-4">
        <Link href="/home" className="font-serif text-xl text-text-primary">
          The Fellowship
        </Link>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <Link
            href="/settings"
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-raised rounded-md transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-base border-t border-border z-50 flex items-center justify-around px-1">
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-colors",
                isActive ? "text-accent-blue" : "text-text-muted hover:text-text-secondary"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-sans font-medium">{item.mobileLabel}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-60 bg-bg-base border-r border-border flex-col">
        {/* Brand */}
        <div className="p-6">
          <Link href="/home" className="font-serif text-2xl text-text-primary">
            The Fellowship
          </Link>
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

          <Link
            href={`/author/${username || 'profile'}`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname.startsWith('/author')
                ? "bg-accent-subtle text-accent-blue"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-raised"
            )}
          >
            <User className="w-4 h-4" />
            Your Profile
          </Link>
        </nav>

        {/* Bottom items */}
        <div className="p-4 space-y-1">
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith('/admin')
                  ? "bg-accent-subtle text-accent-blue"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-raised"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          )}
          <Link
            href="/settings"
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
