import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { reported_id, reported_type, reason, notes, reference_id } = await request.json();

    if (!reported_id || !reported_type || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['vendor', 'customer'].includes(reported_type)) {
      return NextResponse.json({ error: 'Invalid reported_type' }, { status: 400 });
    }

    // Prevent self-report
    if (reported_id === userId) {
      return NextResponse.json({ error: 'Cannot report yourself' }, { status: 400 });
    }

    await query(
      `INSERT INTO reports (reporter_id, reported_id, reported_type, reason, notes, reference_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, reported_id, reported_type, reason, notes || null, reference_id || null]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/reports error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
