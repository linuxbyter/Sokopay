'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Send, ArrowLeft, CheckCircle, Package, Truck, MessageSquare, Star, RotateCcw, Flag, MoreVertical } from 'lucide-react';
import FeedbackModal from './feedback-modal';
import ReportModal from './report-modal';
import { subscribeToChatMessages, subscribeToChatStatus } from '@/lib/ably-client';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
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

interface ChatDialogProps {
  chat: Chat;
  onBack: () => void;
  onChatUpdate?: (chat: Chat) => void;
  isVendor: boolean;
}

export default function ChatDialog({ chat, onBack, onChatUpdate, isVendor }: ChatDialogProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'customer' | 'vendor'>('customer');
  const [showReport, setShowReport] = useState(false);
  const [quickRepliesDismissed, setQuickRepliesDismissed] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat>(chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync activeChat when prop changes (e.g., parent updates selectedChat)
  useEffect(() => {
    setActiveChat(chat);
  }, [chat.id]);

  useEffect(() => {
    fetchMessages();
  }, [activeChat.id]);

  // Real-time: subscribe to Ably chat channel for incoming messages
  useEffect(() => {
    if (!activeChat.id) return;

    const unsubscribeMessages = subscribeToChatMessages(activeChat.id, (message: Message) => {
      if (message.sender_id !== user?.id) {
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    });

    // Real-time: sync transaction status when the other party acts
    const unsubscribeStatus = subscribeToChatStatus(activeChat.id, (updatedChat: Chat) => {
      setActiveChat(prev => {
        const merged = { ...prev, ...updatedChat };
        // Use setTimeout to avoid calling onChatUpdate during render
        setTimeout(() => {
          if (onChatUpdate) onChatUpdate(merged);
        }, 0);
        return merged;
      });
    });

    return () => {
      unsubscribeMessages();
      unsubscribeStatus();
    };
  }, [activeChat.id, user?.id]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chats/${activeChat.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        // Mark incoming messages as read
        if (user?.id) {
          fetch(`/api/chats/${activeChat.id}/messages`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          }).catch(() => {});
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, type: string = 'text') => {
    if (sending) return;
    if (!content.trim() && type === 'text') return;

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender_id: user?.id || '',
      content,
      message_type: type,
      created_at: new Date().toISOString(),
    };

    // Optimistic: show message immediately
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setSending(true);

    try {
      const response = await fetch(`/api/chats/${activeChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user?.id,
          content,
          messageType: type,
        }),
      });

      const data = await response.json();
      if (data.message) {
        // Replace optimistic message with real one
        setMessages(prev => prev.map(m =>
          m.id === optimisticMessage.id ? { ...data.message } : m
        ));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
    } finally {
      setSending(false);
      // Re-focus input so user can keep typing immediately
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleTransactionAction = async (action: string) => {
    try {
      const response = await fetch(`/api/chats/${activeChat.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: user?.id }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state immediately so action buttons re-render
        if (data.chat) {
          setActiveChat(prev => {
            const merged = { ...prev, ...data.chat };
            setTimeout(() => {
              if (onChatUpdate) onChatUpdate(merged);
            }, 0);
            return merged;
          });
        }
        const systemMessage: Message = {
          id: Date.now().toString(),
          sender_id: 'system',
          content: getActionMessage(action),
          message_type: 'system',
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleFeedbackSubmit = async (feedback: { rating: number; comment: string }) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: activeChat.id,
          vendorId: activeChat.vendor_id,
          customerId: activeChat.customer_id,
          rating: feedbackType === 'customer' ? feedback.rating : undefined,
          transactionRating: feedbackType === 'vendor' ? feedback.rating : undefined,
          comment: feedbackType === 'customer' ? feedback.comment : undefined,
          vendorNotes: feedbackType === 'vendor' ? feedback.comment : undefined,
          type: feedbackType,
        }),
      });

      if (response.ok) {
        const systemMessage: Message = {
          id: Date.now().toString(),
          sender_id: 'system',
          content: feedbackType === 'customer' ? 'You left feedback for this vendor' : 'You left feedback for this customer',
          message_type: 'system',
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, systemMessage]);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleBuyAgain = async () => {
    try {
      const customerName = activeChat.customer_name || null;
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: activeChat.vendor_id,
          customerId: activeChat.customer_id,
          customerName,
          newChat: true,
        }),
      });

      const data = await response.json();
      if (data.chat) {
        const newChat: Chat = {
          ...data.chat,
          vendor_name: activeChat.vendor_name,
          vendor_category: activeChat.vendor_category,
        };
        setActiveChat(newChat);
        setMessages([]);
        if (onChatUpdate) {
          onChatUpdate(newChat);
        }
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const getActionMessage = (action: string) => {
    switch (action) {
      case 'mark_paid': return 'Customer has marked this order as paid'
      case 'confirm_payment': return 'Vendor has confirmed payment receipt'
      case 'dispatch': return 'Vendor has dispatched the goods'
      case 'vendor_serve': return 'Vendor has marked this order as served'
      case 'customer_serve': return 'Customer has marked this order as served'
      case 'finalize': return 'This order has been completed'
      default: return 'Action performed'
    }
  };

  const CATEGORY_QUICK_REPLIES: Record<string, string[]> = {
    'Barbers': ['Is there a queue right now?', 'When are you next free?', 'How much for a haircut?', 'Can I book an appointment?'],
    'Salons': ['Is there a queue right now?', 'When are you next free?', 'How much for braids?', 'Can I book an appointment?'],
    'Quick Snacks': ['Is the food ready now?', 'Is it warm and fresh?', 'How long is the queue?', "What's on the menu today?"],
    'Quick Rides': ['Are you available now?', 'How much to [destination]?', 'Where are you currently?', 'Can you come to me?'],
    'Gas Refill': ['Do you have a 6kg cylinder?', 'Do you have a 13kg cylinder?', 'Is delivery available?', "What's the current price?"],
    'Water Vendor': ['I need 20L — are you available?', 'Is delivery available?', 'Payment before or after delivery?', 'How much per 20 litres?'],
    'Mama Mboga': ["What's fresh today?", 'Is [item] available?', 'Do you deliver?', "What are today's prices?"],
    'Groceries': ['Is [item] in stock?', 'Do you deliver?', "What's your M-Pesa number?", 'Are you open now?'],
    'Electronics': ['Is this item in stock?', 'Do you do repairs?', 'What is the warranty?', 'Can we negotiate the price?'],
  };

  const DEFAULT_QUICK_REPLIES = ['Are you open right now?', 'How much does it cost?', 'Do you deliver?', 'Where are you located?'];

  const renderCategoryQuickReplies = () => {
    // Only show to customers, only before any transaction starts, only if not dismissed
    if (isVendor || activeChat.customer_paid || quickRepliesDismissed || activeChat.is_finalized) return null;
    // Only show when few messages (conversation just started)
    if (messages.length > 4) return null;

    const replies = CATEGORY_QUICK_REPLIES[activeChat.vendor_category] || DEFAULT_QUICK_REPLIES;

    return (
      <div className="px-3 pb-2 pt-1 bg-white border-t border-neutral-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-400 font-medium">Quick messages</span>
          <button onClick={() => setQuickRepliesDismissed(true)} className="text-xs text-neutral-400 hover:text-neutral-600 px-1">✕</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {replies.map((reply) => (
            <button
              key={reply}
              onClick={() => setNewMessage(reply)}
              className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-medium rounded-full border border-brand-100 transition-colors whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderQuickActions = () => {
    if (activeChat.is_finalized) {
      return (
        <div className="flex gap-2 flex-wrap p-3 bg-neutral-50 border-t border-neutral-200">
          <button
            onClick={handleBuyAgain}
            className="flex items-center gap-2 px-4 py-3 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors min-h-[48px]"
          >
            <RotateCcw className="w-4 h-4" />
            Buy Again
          </button>
          <button
            onClick={() => {
              setFeedbackType(isVendor ? 'vendor' : 'customer');
              setShowFeedback(true);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-copper-100 text-copper-700 rounded-lg text-sm font-medium hover:bg-copper-200 transition-colors min-h-[48px]"
          >
            <Star className="w-4 h-4" />
            Leave Feedback
          </button>
        </div>
      );
    }

    if (isVendor) {
      // Vendor actions
      if (!activeChat.vendor_confirmed_payment && activeChat.customer_paid) {
        return (
          <div className="flex gap-2 flex-wrap p-3 bg-neutral-50 border-t border-neutral-200">
            <button
              onClick={() => handleTransactionAction('confirm_payment')}
              className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors min-h-[48px]"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm Payment
            </button>
          </div>
        );
      }

      if (activeChat.vendor_confirmed_payment && !activeChat.goods_dispatched) {
        return (
          <div className="flex gap-2 flex-wrap p-3 bg-neutral-50 border-t border-neutral-200">
            <button
              onClick={() => handleTransactionAction('dispatch')}
              className="flex items-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors min-h-[48px]"
            >
              <Package className="w-4 h-4" />
              Mark as Dispatched
            </button>
          </div>
        );
      }

      if (activeChat.goods_dispatched && !activeChat.vendor_marked_served) {
        return (
          <div className="flex gap-2 flex-wrap p-3 bg-neutral-50 border-t border-neutral-200">
            <button
              onClick={() => handleTransactionAction('vendor_serve')}
              className="flex items-center gap-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors min-h-[48px]"
            >
              <Truck className="w-4 h-4" />
              Mark as Served
            </button>
          </div>
        );
      }

      if (activeChat.vendor_marked_served && activeChat.customer_marked_served && !activeChat.is_finalized) {
        return (
          <div className="flex gap-2 flex-wrap p-3 bg-neutral-50 border-t border-neutral-200">
            <button
              onClick={() => handleTransactionAction('finalize')}
              className="flex items-center gap-2 px-4 py-3 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors min-h-[48px]"
            >
              <CheckCircle className="w-4 h-4" />
              Finalize Order
            </button>
          </div>
        );
      }
    } else {
      // Customer actions
      if (!activeChat.customer_paid) {
        return (
          <div className="flex gap-2 flex-wrap p-3 bg-neutral-50 border-t border-neutral-200">
            <button
              onClick={() => handleTransactionAction('mark_paid')}
              className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors min-h-[48px]"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Paid
            </button>
          </div>
        );
      }

      if (activeChat.vendor_marked_served && !activeChat.customer_marked_served) {
        return (
          <div className="flex gap-2 flex-wrap p-3 bg-neutral-50 border-t border-neutral-200">
            <button
              onClick={() => handleTransactionAction('customer_serve')}
              className="flex items-center gap-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors min-h-[48px]"
            >
              <Truck className="w-4 h-4" />
              Confirm Received
            </button>
          </div>
        );
      }

      if (activeChat.vendor_marked_served && activeChat.customer_marked_served && !activeChat.is_finalized) {
        return (
          <div className="flex gap-2 flex-wrap p-3 bg-neutral-50 border-t border-neutral-200">
            <button
              onClick={() => handleTransactionAction('finalize')}
              className="flex items-center gap-2 px-4 py-3 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors min-h-[48px]"
            >
              <CheckCircle className="w-4 h-4" />
              Finalize Order
            </button>
          </div>
        );
      }
    }

    return null;
  };

  const renderTransactionStatus = () => {
    const steps = [
      { label: 'Paid', done: activeChat.customer_paid },
      { label: 'Confirmed', done: activeChat.vendor_confirmed_payment },
      { label: 'Dispatched', done: activeChat.goods_dispatched },
      { label: 'Served', done: activeChat.vendor_marked_served && activeChat.customer_marked_served },
      { label: 'Finalized', done: activeChat.is_finalized },
    ];

    return (
      <div className="flex items-center justify-between p-3 bg-brand-50 border-b border-brand-100">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step.done ? 'bg-brand-600 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                {step.done ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              <span className="text-xs text-neutral-600 mt-1">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${step.done ? 'bg-brand-600' : 'bg-neutral-200'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-neutral-200 bg-white">
        <button
          onClick={onBack}
          className="p-3 hover:bg-neutral-100 rounded-lg transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </button>
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900">
            {isVendor
              ? activeChat.customer_name || 'Customer'
              : activeChat.vendor_name}
          </h3>
          <p className="text-sm text-neutral-500">
            {isVendor ? activeChat.vendor_category : activeChat.vendor_category}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            activeChat.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {activeChat.status === 'completed' ? 'Completed' : 'Active'}
          </div>
          <button
            onClick={() => setShowReport(true)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title={`Report this ${isVendor ? 'customer' : 'vendor'}`}
          >
            <Flag className="w-4 h-4 text-neutral-300 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Transaction Status */}
      {renderTransactionStatus()}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500">
            <MessageSquare className="w-12 h-12 mb-3 text-neutral-300" />
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.message_type === 'system'
                  ? 'justify-center'
                  : message.sender_id === user?.id
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {message.message_type === 'system' ? (
                <div className="px-3 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600">
                  {message.content}
                </div>
              ) : (
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    message.sender_id === user?.id
                      ? 'bg-brand-600 text-white rounded-br-md'
                      : 'bg-neutral-100 text-neutral-900 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === user?.id ? 'text-brand-200' : 'text-neutral-500'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Category Quick Replies */}
      {renderCategoryQuickReplies()}

      {/* Message Input */}
      {!activeChat.is_finalized && (
        <div className="p-4 border-t border-neutral-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(newMessage)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-neutral-200 rounded-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[48px]"
              autoComplete="off"
            />
            <button
              onClick={() => sendMessage(newMessage)}
              disabled={!newMessage.trim() || sending}
              className="p-3 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50 min-h-[48px] min-w-[48px] flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        reportedId={isVendor ? activeChat.customer_id : activeChat.vendor_id}
        reportedType={isVendor ? 'customer' : 'vendor'}
        reportedName={isVendor ? (activeChat.customer_name || 'Customer') : activeChat.vendor_name}
        referenceId={activeChat.id}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
        type={feedbackType}
        vendorName={activeChat.vendor_name}
      />
    </div>
  );
}
