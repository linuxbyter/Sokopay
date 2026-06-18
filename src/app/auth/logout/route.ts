import { NextResponse } from 'next/server';
import { auth, signOut } from '@clerk/nextjs/server';

export async function POST() {
  await signOut();
  return new NextResponse(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}