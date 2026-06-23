import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Submit feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId, vendorId, customerId, rating, transactionRating, comment, vendorNotes, type } = body

    if (!chatId || !vendorId || !customerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let result

    if (type === 'customer') {
      // Customer feedback
      result = await query(
        `INSERT INTO feedback (chat_id, vendor_id, customer_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (chat_id, customer_id) 
         DO UPDATE SET rating = $4, comment = $5
         RETURNING *`,
        [chatId, vendorId, customerId, rating, comment]
      )
    } else {
      // Vendor feedback
      result = await query(
        `INSERT INTO feedback (chat_id, vendor_id, customer_id, transaction_rating, vendor_notes)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (chat_id, customer_id)
         DO UPDATE SET transaction_rating = $4, vendor_notes = $5
         RETURNING *`,
        [chatId, vendorId, customerId, transactionRating, vendorNotes]
      )
    }

    // Add system message about feedback
    await query(
      `INSERT INTO messages (chat_id, sender_id, content, message_type) VALUES ($1, $2, $3, 'system')`,
      [chatId, 'system', type === 'customer' ? 'Customer has left feedback' : 'Vendor has left feedback']
    )

    return NextResponse.json({ feedback: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('POST /api/feedback error:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}

// Get feedback for a chat
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')

    if (!chatId) {
      return NextResponse.json({ error: 'Missing chatId' }, { status: 400 })
    }

    const result = await query(
      'SELECT * FROM feedback WHERE chat_id = $1',
      [chatId]
    )

    return NextResponse.json({ feedback: result.rows })
  } catch (error) {
    console.error('GET /api/feedback error:', error)
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}
