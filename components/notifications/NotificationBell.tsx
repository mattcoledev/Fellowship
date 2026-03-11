'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { 
  Notification, 
  getNotifications, 
  getUnreadCount, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '@/lib/db-client'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadNotifications()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function loadNotifications() {
    try {
      const [notifs, count] = await Promise.all([
        getNotifications(10),
        getUnreadCount()
      ])
      setNotifications(notifs)
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadUnreadCount() {
    try {
      const count = await getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  async function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      await markNotificationRead(notification.id)
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    setIsOpen(false)
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  function getNotificationMessage(notification: Notification): { text: string; link: string } {
    const actorName = notification.actor?.display_name || notification.actor?.username || 'Someone'
    
    switch (notification.type) {
      case 'post_reply':
        return {
          text: `${actorName} commented on your post — ${notification.post?.title || 'Untitled'}`,
          link: `/common/${notification.post?.slug || ''}`
        }
      case 'comment_reply':
        return {
          text: `${actorName} replied to your comment in — ${notification.post?.title || 'Untitled'}`,
          link: `/common/${notification.post?.slug || ''}`
        }
      case 'thread_reply':
        return {
          text: `${actorName} replied to your thread — ${notification.thread?.title || notification.thread?.body?.slice(0, 40) + '...' || 'Thread'}`,
          link: `/forum/${notification.thread_id}`
        }
      case 'forum_reply':
        return {
          text: `${actorName} replied to your comment in — ${notification.thread?.title || notification.thread?.body?.slice(0, 40) + '...' || 'Thread'}`,
          link: `/forum/${notification.thread_id}`
        }
      default:
        return { text: 'New notification', link: '/' }
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-medium bg-accent-blue text-white rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-sans text-sm font-medium text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="font-sans text-xs text-accent-blue hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center">
                <p className="font-sans text-sm text-text-muted">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="font-sans text-sm text-text-muted">No notifications yet</p>
              </div>
            ) : (
              <ul>
                {notifications.map(notification => {
                  const { text, link } = getNotificationMessage(notification)
                  return (
                    <li key={notification.id}>
                      <Link
                        href={link}
                        onClick={() => handleNotificationClick(notification)}
                        className={`block px-4 py-3 hover:bg-bg-raised transition-colors border-b border-border last:border-b-0 ${
                          !notification.read ? 'bg-bg-raised/50' : ''
                        }`}
                      >
                        <p className={`font-sans text-sm ${!notification.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {text}
                        </p>
                        <p className="font-sans text-xs text-text-muted mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
