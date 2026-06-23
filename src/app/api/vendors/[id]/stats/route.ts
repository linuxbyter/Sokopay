import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await query(
      `SELECT
        (SELECT COUNT(*)::int FROM chats WHERE vendor_id = $1 AND is_finalized = true) as customers_served,
        (SELECT COUNT(*)::int FROM feedback WHERE vendor_id = $1) as total_feedback,
        (SELECT COALESCE(AVG(rating), 0)::numeric(3,1) FROM feedback WHERE vendor_id = $1 AND rating IS NOT NULL) as average_rating,
        (SELECT COUNT(*)::int FROM messages m JOIN chats c ON m.chat_id = c.id WHERE c.vendor_id = $1) as total_messages`,
      [id]
    )

    const stats = result.rows[0]
    return NextResponse.json({
      customersServed: stats.customers_served || 0,
      totalFeedback: stats.total_feedback || 0,
      averageRating: parseFloat(stats.average_rating) || 0,
      totalMessages: stats.total_messages || 0,
    })
  } catch (error: any) {
    console.error('GET /api/vendors/[id]/stats error:', error)
    if (error.code === '42P01') {
      return NextResponse.json({ error: 'Table not found' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
