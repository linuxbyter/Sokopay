import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await query('SELECT * FROM vendors WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    return NextResponse.json({ vendor: result.rows[0] }, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' },
    })
  } catch (error) {
    console.error('GET /api/vendors/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Verify ownership
    const owner = await query('SELECT user_id FROM vendors WHERE id = $1', [id])
    if (owner.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }
    if (owner.rows[0].user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const fields: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    const allowedFields = [
      'business_name', 'category', 'category_secondary', 'description',
      'address', 'latitude', 'longitude', 'hours', 'services',
      'whatsapp', 'phone', 'photos', 'is_open'
    ]

    for (const [key, value] of Object.entries(body)) {
      const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      if (allowedFields.includes(dbField)) {
        fields.push(`${dbField} = $${paramIndex}`)
        values.push(typeof value === 'object' ? JSON.stringify(value) : value)
        paramIndex++
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    fields.push(`last_updated = NOW()`)
    values.push(id)

    const result = await query(
      `UPDATE vendors SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    return NextResponse.json({ vendor: result.rows[0] })
  } catch (error) {
    console.error('PUT /api/vendors/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Verify ownership
    const owner = await query('SELECT user_id FROM vendors WHERE id = $1', [id])
    if (owner.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }
    if (owner.rows[0].user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Block deletion if any transaction has money involved (customer_paid but not finalized)
    const paidUnfinalized = await query(
      `SELECT COUNT(*) FROM chats
       WHERE vendor_id = $1 AND customer_paid = true AND is_finalized = false`,
      [id]
    )
    if (parseInt(paidUnfinalized.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete shop while transactions are in progress. All paid orders must be finalized first.' },
        { status: 400 }
      )
    }

    // Also block if any unfinalized chats exist (dispute protection)
    const activeChats = await query(
      'SELECT COUNT(*) FROM chats WHERE vendor_id = $1 AND is_finalized = false',
      [id]
    )
    if (parseInt(activeChats.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete shop with open conversations. Ask customers to finalize all chats first, or deactivate your shop instead.' },
        { status: 400 }
      )
    }

    const result = await query('DELETE FROM vendors WHERE id = $1 RETURNING id', [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/vendors/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 })
  }
}
