import { NextResponse } from 'next/server';

export async function POST() {
  // For Clerk in App Router, sign out is typically handled client-side
  // Return success and let client handle the actual sign out via Clerk's frontend
  return new NextResponse(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}