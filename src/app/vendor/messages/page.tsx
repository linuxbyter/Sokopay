'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import Navbar from '@/components/navbar';
import ChatDialog from '@/components/chat-dialog';

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
}

interface Chat {
  id: string;
  vendor_id: string;
  customer_id: string;
  customer_name: string | null;
  vendor_name: string;
  vendor_category: string;
  status: string;
  customer_paid: boolean;
  vendor_confirmed_payment: boolean;
  goods_dispatched: boolean;
  vendor_marked_served: boolean;
  customer_marked_served: boolean;
  is_finalized: boolean;
  updated_at: string;
  last_message?: string | null;
  last_message_at?: string | null;
  last_message_sender?: string | null;
  unread_count?: number;
}

export default function VendorMessagesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/role');
      return;
    }

    fetchChats();
  }, [isLoaded, user]);

  const fetchChats = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/chats?userId=${user.id}&role=vendor`);
      const data = await response.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-2xl mx-auto h-screen">
          <ChatDialog
            chat={selectedChat}
            onBack={() => setSelectedChat(null)}
            onChatUpdate={(updatedChat) => setSelectedChat(updatedChat)}
            isVendor={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar title="Messages" />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No messages yet</h3>
            <p className="text-neutral-500">
              Customers will message you here after viewing your profile.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-copper-100 rounded-full flex items-center justify-center">
                    <span className="text-copper-600 font-semibold">
                      {chat.customer_name?.charAt(0)?.toUpperCase() || 'C'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-neutral-900 truncate">
                        {chat.customer_name || 'Customer'}
                      </h4>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        {chat.last_message_at && (
                          <span className="text-xs text-neutral-400 whitespace-nowrap">
                            {timeAgo(chat.last_message_at)}
                          </span>
                        )}
                        {(chat.unread_count ?? 0) > 0 && (
                          <span className="w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {chat.unread_count! > 9 ? '9+' : chat.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      {chat.last_message ? (
                        <p className="text-sm text-neutral-600 truncate">{chat.last_message}</p>
                      ) : (
                        <p className="text-sm text-neutral-400 italic">No messages yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
