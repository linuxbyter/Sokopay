import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Get or create a chat between customer and vendor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendorId, customerId, customerName, newChat } = body

    if (!vendorId || !customerId) {
      return NextResponse.json({ error: 'Missing vendorId or customerId' }, { status: 400 })
    }

    // If newChat is requested, create a fresh chat (for "Buy Again" flow)
    if (newChat) {
      const result = await query(
        'INSERT INTO chats (vendor_id, customer_id, customer_name) VALUES ($1, $2, $3) RETURNING *',
        [vendorId, customerId, customerName || null]
      )
      return NextResponse.json({ chat: result.rows[0] }, { status: 201 })
    }

    // Check if an active (non-finalized) chat already exists
    const existing = await query(
      'SELECT * FROM chats WHERE vendor_id = $1 AND customer_id = $2 AND is_finalized = false ORDER BY created_at DESC LIMIT 1',
      [vendorId, customerId]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json({ chat: existing.rows[0] })
    }

    // No active chat found — create a new one
    const result = await query(
      'INSERT INTO chats (vendor_id, customer_id, customer_name) VALUES ($1, $2, $3) RETURNING *',
      [vendorId, customerId, customerName || null]
    )

    return NextResponse.json({ chat: result.rows[0] }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/chats error:', error)
    if (error.code === '42P01') {
      return NextResponse.json({ error: 'Chats table not found. Please run the database schema.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 })
  }
}

// Get all chats for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const role = searchParams.get('role') // 'vendor' or 'customer'

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 })
    }

    let sql = ''
    const params: unknown[] = []

    if (role === 'vendor') {
      params.push(userId)
      sql = `
        SELECT c.*,
          v.business_name as vendor_name, v.category as vendor_category, v.photos as vendor_photos
        FROM chats c
        JOIN vendors v ON c.vendor_id = v.id
        WHERE v.user_id = $1
        ORDER BY c.updated_at DESC
      `
    } else {
      params.push(userId)
      sql = `
        SELECT c.*,
          v.business_name as vendor_name, v.category as vendor_category, v.photos as vendor_photos,
          v.id as vendor_id, v.user_id as vendor_user_id
        FROM chats c
        JOIN vendors v ON c.vendor_id = v.id
        WHERE c.customer_id = $1
        ORDER BY c.updated_at DESC
      `
    }

    const result = await query(sql, params)
    return NextResponse.json({ chats: result.rows })
  } catch (error: any) {
    console.error('GET /api/chats error:', error)
    if (error.code === '42P01') {
      return NextResponse.json({ error: 'Chats table not found. Please run the database schema.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
  }
}
