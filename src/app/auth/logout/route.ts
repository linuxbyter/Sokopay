import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  const authData = await auth();
  await authData.signOut();
  return new NextResponse(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}