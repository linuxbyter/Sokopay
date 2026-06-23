import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

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

    return NextResponse.json({ vendor: result.rows[0] })
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
    const { id } = params
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
