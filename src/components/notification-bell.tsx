'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';
import { Bell, MessageSquare, Star, Zap, Info, CheckCheck } from 'lucide-react';
import { subscribeToNotifications } from '@/lib/ably-client';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/notifications?userId=${user.id}`);
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Subscribe to real-time notifications via Pusher
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToNotifications(user.id, (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return unsubscribe;
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await fetch(`/api/notifications/read-all?userId=${user.id}`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'feedback': return <Star className="w-4 h-4 text-copper-500" />;
      case 'transaction': return <Zap className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-neutral-500" />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-lg hover:bg-neutral-100 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
      >
        <Bell className="w-5 h-5 text-neutral-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-neutral-100 z-50 max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <h3 className="font-semibold text-neutral-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 px-2 py-1.5 rounded min-h-[36px]"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Bell className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                    className={`px-4 py-3 border-b border-neutral-50 cursor-pointer hover:bg-neutral-50 transition-colors ${
                      !notification.is_read ? 'bg-brand-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium ${!notification.is_read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        {notification.body && (
                          <p className="text-xs text-neutral-500 mt-0.5 truncate">{notification.body}</p>
                        )}
                        <p className="text-xs text-neutral-400 mt-1">{timeAgo(notification.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
