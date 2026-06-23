import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let userId: string | null = null

  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId: uid } = await auth()
    userId = uid
  } catch (error: any) {
    console.warn('Clerk auth initialization failed:', error.message)
    userId = null
  }

  const { pathname } = req.nextUrl

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (userId && pathname.startsWith('/auth/')) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/role',
    '/auth/login',
    '/auth/logout',
    '/about',
  ]

  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith(path + '/')
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Protected routes: require authentication
  if (!userId) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/role'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
