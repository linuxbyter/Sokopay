'use client'

import * as Ably from 'ably'

const ABLY_KEY = process.env.NEXT_PUBLIC_ABLY_API_KEY || ''

export const ablyClient = ABLY_KEY
  ? new Ably.Realtime({
      key: ABLY_KEY,
    })
  : null

export function subscribeToNotifications(userId: string, onNotification: (notification: any) => void) {
  if (!ablyClient) return () => {}

  const channel = ablyClient.channels.get(`user-${userId}`)

  channel.subscribe('notification', (message) => {
    onNotification(message.data)
  })

  return () => {
    channel.unsubscribe('notification')
  }
}
