import Pusher from 'pusher'

if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET) {
  console.warn('Pusher credentials not configured. Notifications will not work in real-time.')
}

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true,
})

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
  try {
    await pusher.trigger(`user-${userId}`, 'notification', notification)
  } catch (error) {
    console.error('Failed to trigger Pusher notification:', error)
  }
}
