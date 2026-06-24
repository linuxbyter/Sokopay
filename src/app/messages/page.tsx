'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageSquare, Store } from 'lucide-react';
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
}

function MessagesContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatIdParam = searchParams.get('chatId');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/role');
      return;
    }

    // Determine if user is vendor or customer based on URL
    const path = window.location.pathname;
    setIsVendor(path.startsWith('/vendor'));

    fetchChats();
  }, [isLoaded, user]);

  const fetchChats = async () => {
    if (!user) return;

    try {
      const role = window.location.pathname.startsWith('/vendor') ? 'vendor' : 'customer';
      const response = await fetch(`/api/chats?userId=${user.id}&role=${role}`);
      const data = await response.json();
      const chatList = data.chats || [];
      setChats(chatList);

      // Auto-select chat from URL param (deep-link from notifications)
      if (chatIdParam) {
        const target = chatList.find((c: Chat) => c.id === chatIdParam);
        if (target) setSelectedChat(target);
      }
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
            isVendor={isVendor}
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
              {isVendor
                ? 'Customers will message you here after viewing your profile.'
                : 'Start a conversation with a vendor from their profile.'}
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
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                    <Store className="w-6 h-6 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-neutral-900 truncate">{chat.vendor_name}</h4>
                      {chat.last_message_at && (
                        <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
                          {timeAgo(chat.last_message_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">{chat.vendor_category}</p>
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

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
