import Ably from 'ably'

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
