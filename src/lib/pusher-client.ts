'use client'

import PusherClient from 'pusher-js'

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || ''
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu'

export const pusherClient = PUSHER_KEY
  ? new PusherClient(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    })
  : null

export function subscribeToNotifications(userId: string, onNotification: (notification: any) => void) {
  if (!pusherClient) return () => {}

  const channel = pusherClient.subscribe(`user-${userId}`)
  channel.bind('notification', onNotification)

  return () => {
    channel.unbind('notification')
    pusherClient.unsubscribe(`user-${userId}`)
  }
}
