import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { triggerNotification } from '@/lib/ably'

// Get messages for a chat
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await query(
      `SELECT m.*,
        CASE
          WHEN m.sender_id LIKE 'user_%' THEN 'customer'
          ELSE 'vendor'
        END as sender_type
       FROM messages m
       WHERE m.chat_id = $1
       ORDER BY m.created_at ASC`,
      [id]
    )

    return NextResponse.json({ messages: result.rows })
  } catch (error) {
    console.error('GET /api/chats/[id]/messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { senderId, content, messageType = 'text' } = body

    if (!senderId || !content) {
      return NextResponse.json({ error: 'Missing senderId or content' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO messages (chat_id, sender_id, content, message_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, senderId, content, messageType]
    )

    // Update chat's updated_at timestamp
    await query('UPDATE chats SET updated_at = NOW() WHERE id = $1', [id])

    // Notify the other party (skip for system messages)
    if (messageType !== 'system') {
      try {
        const chatResult = await query(
          'SELECT vendor_id, customer_id FROM chats WHERE id = $1',
          [id]
        )
        if (chatResult.rows.length > 0) {
          const chat = chatResult.rows[0]
          // Determine recipient: if sender is customer, notify vendor and vice versa
          const recipientId = senderId === chat.customer_id
            ? (await query('SELECT user_id FROM vendors WHERE id = $1', [chat.vendor_id])).rows[0]?.user_id
            : chat.customer_id

          if (recipientId) {
            const notifResult = await query(
              `INSERT INTO notifications (user_id, type, title, body, reference_id, reference_type)
               VALUES ($1, 'message', 'New message', $2, $3, 'chat') RETURNING *`,
              [recipientId, content.substring(0, 100), id]
            )
            await triggerNotification(recipientId, notifResult.rows[0])
          }
        }
      } catch (notifError) {
        console.error('Failed to send notification:', notifError)
        // Don't fail the message send if notification fails
      }
    }

    return NextResponse.json({ message: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('POST /api/chats/[id]/messages error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
