import { publishMessage, ChatMessage } from '@sokopay/chat'
import { sendWebPush } from './web-push'

export async function triggerNotification(userId: string, notification: {
  id: string
  type: string
  title: string
  body: string | null
  reference_id: string | null
  reference_type: string | null
  is_read: boolean
  created_at: string
}) {
  // Send Web Push for PWA users
  const url = notification.reference_type === 'chat'
    ? `/messages?chatId=${notification.reference_id}`
    : '/dashboard'

  await sendWebPush(userId, {
    title: notification.title,
    body: notification.body || '',
    url,
    tag: notification.reference_id || 'sokopay',
  }).catch(() => {})
}

export async function publishChatStatus(chatId: string, chat: Record<string, unknown>) {
  // TODO: Implement chat status publishing
}

export async function publishChatMessage(chatId: string, message: {
  id: string
  chat_id: string
  sender_id: string
  content: string
  message_type: string
  created_at: string
}) {
  const chatMessage: ChatMessage = {
    id: message.id,
    chatId: message.chat_id,
    senderId: message.sender_id,
    content: message.content,
    createdAt: message.created_at,
  }
  
  await publishMessage(chatId, chatMessage)
}
