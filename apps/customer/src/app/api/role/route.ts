import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Get role for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const result = await query('SELECT role FROM user_roles WHERE user_id = $1', [userId])

    if (result.rows.length === 0) {
      return NextResponse.json({ role: null })
    }

    return NextResponse.json({ role: result.rows[0].role })
  } catch (error: any) {
    console.error('GET /api/role error:', error)
    if (error.code === '42P01') {
      return NextResponse.json({ role: null })
    }
    return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 })
  }
}

// Set role for a user (one-time only — won't overwrite if already set)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 })
    }

    if (!['customer', 'vendor'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be "customer" or "vendor".' }, { status: 400 })
    }

    // Upsert: set role if not exists, or keep existing
    const result = await query(
      `INSERT INTO user_roles (user_id, role) VALUES ($1, $2)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING *`,
      [userId, role]
    )

    // Return current role (either newly set or existing)
    const current = await query('SELECT role FROM user_roles WHERE user_id = $1', [userId])

    return NextResponse.json({ role: current.rows[0]?.role || role, created: result.rows.length > 0 })
  } catch (error: any) {
    console.error('POST /api/role error:', error)
    if (error.code === '42P01') {
      return NextResponse.json({ error: 'User roles table not found. Please run the database schema.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to set role' }, { status: 500 })
  }
}
