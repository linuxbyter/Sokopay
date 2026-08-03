import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Mark all notifications as read for a user
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    await query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /api/notifications/read-all error:', error)
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 })
  }
}
