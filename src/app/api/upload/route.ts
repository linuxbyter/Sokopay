import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendorId, images } = body

    if (!vendorId || !images || images.length === 0) {
      return NextResponse.json({ error: 'Missing vendorId or images' }, { status: 400 })
    }

    if (images.length > 3) {
      return NextResponse.json({ error: 'Maximum 3 images allowed' }, { status: 400 })
    }

    // Store images as base64 in the database
    const result = await query(
      'UPDATE vendors SET photos = $1, last_updated = NOW() WHERE id = $2 RETURNING *',
      [images, vendorId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    return NextResponse.json({ vendor: result.rows[0] })
  } catch (error) {
    console.error('POST /api/upload error:', error)
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 })
  }
}
