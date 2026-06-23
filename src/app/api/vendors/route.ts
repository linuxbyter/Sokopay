import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    let sql = 'SELECT * FROM vendors'
    const conditions: string[] = []
    const params: unknown[] = []

    if (category) {
      params.push(category)
      conditions.push(`category = $${params.length}`)
    }

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(business_name ILIKE $${params.length} OR description ILIKE $${params.length} OR category ILIKE $${params.length})`)
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    sql += ' ORDER BY created_at DESC'

    const result = await query(sql, params)
    return NextResponse.json({ vendors: result.rows })
  } catch (error) {
    console.error('GET /api/vendors error:', error)
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      businessName,
      category,
      categorySecondary,
      description,
      address,
      latitude,
      longitude,
      hours,
      services,
      whatsapp,
      phone,
      photos,
    } = body

    if (!userId || !businessName || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO vendors (
        user_id, business_name, category, category_secondary, description,
        address, latitude, longitude, hours, services, whatsapp, phone, photos
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        userId,
        businessName,
        category,
        categorySecondary || null,
        description || null,
        address || null,
        latitude || null,
        longitude || null,
        hours ? JSON.stringify(hours) : null,
        services ? JSON.stringify(services) : null,
        whatsapp || null,
        phone || null,
        photos || [],
      ]
    )

    return NextResponse.json({ vendor: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('POST /api/vendors error:', error)
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
  }
}
