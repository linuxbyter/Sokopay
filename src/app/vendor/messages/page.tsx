'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { MessageSquare, Store } from 'lucide-react';
import Navbar from '@/components/navbar';
import ChatDialog from '@/components/chat-dialog';

interface Chat {
  id: string;
  vendor_id: string;
  customer_id: string;
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
                      {(chat as any).customer_name?.charAt(0)?.toUpperCase() || chat.customer_id.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-neutral-900 truncate">
                        {(chat as any).customer_name || `Customer ${chat.customer_id.slice(0, 8)}`}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        chat.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {chat.status === 'completed' ? 'Done' : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${chat.customer_paid ? 'bg-green-500' : 'bg-neutral-300'}`} />
                      <span className="text-xs text-neutral-500">
                        {chat.is_finalized ? 'Completed' : 
                         chat.customer_paid ? 'In Progress' : 'Pending Payment'}
                      </span>
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
