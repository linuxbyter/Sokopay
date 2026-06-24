import Ably from 'ably'
import { sendWebPush } from './web-push'

if (!process.env.ABLY_APP_ID || !process.env.ABLY_API_KEY) {
  console.warn('Ably credentials not configured. Notifications will not work in real-time.')
}

let ably: Ably.Realtime | null = null

export function getAbly(): Ably.Realtime | null {
  if (!ably && process.env.ABLY_API_KEY) {
    ably = new Ably.Realtime({
      key: process.env.ABLY_API_KEY,
      clientId: 'sokopay-server',
    })
  }
  return ably
}

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
  const client = getAbly()
  if (!client) {
    console.warn('Ably not configured, skipping real-time notification')
    return
  }

  try {
    const channel = client.channels.get(`user-${userId}`)
    await channel.publish('notification', notification)
  } catch (error) {
    console.error('Failed to publish Ably notification:', error)
  }

  // Also send a Web Push so installed PWA users get notified in the background
  const url = notification.reference_type === 'chat'
    ? `/messages?chatId=${notification.reference_id}`
    : '/dashboard';

  await sendWebPush(userId, {
    title: notification.title,
    body: notification.body || '',
    url,
    tag: notification.reference_id || 'sokopay',
  }).catch(() => {});
}

export async function publishChatStatus(chatId: string, chat: Record<string, unknown>) {
  const client = getAbly()
  if (!client) return

  try {
    const channel = client.channels.get(`chat-${chatId}`)
    await channel.publish('status', chat)
  } catch (error) {
    console.error('Failed to publish chat status:', error)
  }
}

export async function publishChatMessage(chatId: string, message: {
  id: string
  chat_id: string
  sender_id: string
  content: string
  message_type: string
  created_at: string
}) {
  const client = getAbly()
  if (!client) return

  try {
    const channel = client.channels.get(`chat-${chatId}`)
    await channel.publish('message', message)
  } catch (error) {
    console.error('Failed to publish chat message:', error)
  }
}
