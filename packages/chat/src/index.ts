import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  content: string
  createdAt: string
  readAt?: string
}

export interface Chat {
  id: string
  vendorId: string
  customerId: string
  createdAt: string
  updatedAt: string
  lastMessage?: ChatMessage
}

export async function publishMessage(chatId: string, message: ChatMessage): Promise<void> {
  await redis.publish(`chat:${chatId}`, JSON.stringify(message))
  
  await redis.hset(`chat:${chatId}:last`, {
    content: message.content,
    senderId: message.senderId,
    createdAt: message.createdAt,
  })
  
  await redis.zadd(`user:${message.senderId}:chats`, {
    score: Date.now(),
    member: chatId,
  })
}

export async function subscribeToChat(
  chatId: string,
  callback: (message: ChatMessage) => void
): Promise<() => void> {
  // For now, use polling as Upstash REST API doesn't support native pub/sub
  // In production, use Upstash Redis with WebSocket support or a different approach
  const interval = setInterval(() => {
    // Polling implementation would go here
    // For now, this is a placeholder
  }, 5000)

  return () => {
    clearInterval(interval)
  }
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const chatIds = await redis.zrange<string[]>(`user:${userId}:chats`, 0, -1, {
    rev: true,
  })
  
  const chats: Chat[] = []
  for (const chatId of chatIds) {
    const lastMessage = await redis.hgetall(`chat:${chatId}:last`)
    if (lastMessage) {
      chats.push({
        id: chatId,
        vendorId: "",
        customerId: "",
        createdAt: "",
        updatedAt: "",
        lastMessage: {
          id: "",
          chatId,
          senderId: lastMessage.senderId as string,
          content: lastMessage.content as string,
          createdAt: lastMessage.createdAt as string,
        },
      })
    }
  }
  
  return chats
}

export async function markAsRead(chatId: string, userId: string): Promise<void> {
  await redis.hset(`chat:${chatId}:read`, {
    [userId]: new Date().toISOString(),
  })
}
