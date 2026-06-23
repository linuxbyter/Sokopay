import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { triggerNotification } from '@/lib/ably'

// Update transaction status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { action, userId } = body

    if (!action || !userId) {
      return NextResponse.json({ error: 'Missing action or userId' }, { status: 400 })
    }

    let updateSql = ''
    let messageContent = ''
    let notifTitle = ''

    switch (action) {
      case 'mark_paid':
        updateSql = 'UPDATE chats SET customer_paid = true, updated_at = NOW() WHERE id = $1'
        messageContent = 'Customer has marked this order as paid'
        notifTitle = 'Payment marked by customer'
        break
      case 'confirm_payment':
        updateSql = 'UPDATE chats SET vendor_confirmed_payment = true, updated_at = NOW() WHERE id = $1'
        messageContent = 'Vendor has confirmed payment receipt'
        notifTitle = 'Payment confirmed by vendor'
        break
      case 'dispatch':
        updateSql = 'UPDATE chats SET goods_dispatched = true, updated_at = NOW() WHERE id = $1'
        messageContent = 'Vendor has dispatched the goods'
        notifTitle = 'Goods dispatched'
        break
      case 'vendor_serve':
        updateSql = 'UPDATE chats SET vendor_marked_served = true, updated_at = NOW() WHERE id = $1'
        messageContent = 'Vendor has marked this order as served'
        notifTitle = 'Order marked as served by vendor'
        break
      case 'customer_serve':
        updateSql = 'UPDATE chats SET customer_marked_served = true, updated_at = NOW() WHERE id = $1'
        messageContent = 'Customer has marked this order as served'
        notifTitle = 'Order received by customer'
        break
      case 'finalize':
        updateSql = "UPDATE chats SET status = 'completed', is_finalized = true, updated_at = NOW() WHERE id = $1"
        messageContent = 'This order has been completed'
        notifTitle = 'Order completed'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await query(updateSql, [id])

    // Add system message
    await query(
      `INSERT INTO messages (chat_id, sender_id, content, message_type) VALUES ($1, $2, $3, 'system')`,
      [id, 'system', messageContent]
    )

    // Notify the other party
    try {
      const chatResult = await query(
        'SELECT vendor_id, customer_id FROM chats WHERE id = $1',
        [id]
      )
      if (chatResult.rows.length > 0) {
        const chat = chatResult.rows[0]
        // Notify the opposite party
        const recipientId = userId === chat.customer_id
          ? (await query('SELECT user_id FROM vendors WHERE id = $1', [chat.vendor_id])).rows[0]?.user_id
          : chat.customer_id

        if (recipientId) {
          const notifResult = await query(
            `INSERT INTO notifications (user_id, type, title, body, reference_id, reference_type)
             VALUES ($1, 'transaction', $2, $3, $4, 'chat') RETURNING *`,
            [recipientId, notifTitle, messageContent, id]
          )
          await triggerNotification(recipientId, notifResult.rows[0])
        }
      }
    } catch (notifError) {
      console.error('Failed to send notification:', notifError)
    }

    // Get updated chat
    const result = await query('SELECT * FROM chats WHERE id = $1', [id])

    return NextResponse.json({ chat: result.rows[0] })
  } catch (error) {
    console.error('PUT /api/chats/[id]/status error:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
