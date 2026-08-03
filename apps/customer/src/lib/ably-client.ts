'use client'

import { subscribeToChat, ChatMessage } from '@sokopay/chat'

export function subscribeToNotifications(userId: string, onNotification: (notification: any) => void) {
  // TODO: Implement notification subscription with @sokopay/chat
  return () => {}
}

export function subscribeToChatMessages(chatId: string, onMessage: (message: any) => void) {
  let cleanup: (() => void) | null = null
  
  subscribeToChat(chatId, (chatMessage: ChatMessage) => {
    onMessage({
      id: chatMessage.id,
      sender_id: chatMessage.senderId,
      content: chatMessage.content,
      message_type: 'text',
      created_at: chatMessage.createdAt,
    })
  }).then((unsub) => {
    cleanup = unsub
  }).catch(() => {})
  
  return () => {
    cleanup?.()
  }
}

export function subscribeToChatStatus(chatId: string, onStatus: (chat: any) => void) {
  // TODO: Implement chat status subscription
  return () => {}
}
