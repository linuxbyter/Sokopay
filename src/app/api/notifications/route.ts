import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { pusher, triggerNotification } from '@/lib/pusher'

// Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    let sql = 'SELECT * FROM notifications WHERE user_id = $1'
    const params: unknown[] = [userId]

    if (unreadOnly) {
      sql += ' AND is_read = false'
    }

    sql += ' ORDER BY created_at DESC LIMIT 50'

    const result = await query(sql, params)

    // Also get unread count
    const countResult = await query(
      'SELECT COUNT(*)::int as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    )

    return NextResponse.json({
      notifications: result.rows,
      unreadCount: countResult.rows[0].count,
    })
  } catch (error: any) {
    console.error('GET /api/notifications error:', error)
    if (error.code === '42P01') {
      return NextResponse.json({ error: 'Notifications table not found' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// Create a notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, body: notifBody, referenceId, referenceType } = body

    if (!userId || !type || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO notifications (user_id, type, title, body, reference_id, reference_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, type, title, notifBody || null, referenceId || null, referenceType || null]
    )

    const notification = result.rows[0]

    // Trigger real-time notification via Pusher
    await triggerNotification(userId, {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      reference_id: notification.reference_id,
      reference_type: notification.reference_type,
      is_read: notification.is_read,
      created_at: notification.created_at,
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/notifications error:', error)
    if (error.code === '42P01') {
      return NextResponse.json({ error: 'Notifications table not found' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
