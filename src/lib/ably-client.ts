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

export function subscribeToChatMessages(chatId: string, onMessage: (message: any) => void) {
  if (!ablyClient) return () => {}

  const channel = ablyClient.channels.get(`chat-${chatId}`)

  channel.subscribe('message', (message) => {
    onMessage(message.data)
  })

  return () => {
    channel.unsubscribe('message')
  }
}

export function subscribeToChatStatus(chatId: string, onStatus: (chat: any) => void) {
  if (!ablyClient) return () => {}

  const channel = ablyClient.channels.get(`chat-${chatId}`)

  channel.subscribe('status', (message) => {
    onStatus(message.data)
  })

  return () => {
    channel.unsubscribe('status')
  }
}
