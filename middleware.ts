import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function middleware(req: NextRequest) {
  const { userId } = await auth()
  const { pathname } = req.nextUrl

  // Define paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/verify',
    '/auth/logout',
    '/about',
  ]

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname.startsWith(path)
  )

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If not authenticated and trying to access a protected route, redirect to login
  if (!userId) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // If authenticated and trying to access auth pages, redirect to home
  if (userId && pathname.startsWith('/auth/')) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Otherwise, allow access
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}