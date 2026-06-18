import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let userId: string | null = null
  
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId: uid } = await auth()
    userId = uid
  } catch (error) {
    // During build time or if Clerk is not properly initialized,
    // we allow all requests to proceed to avoid blocking the build
    // In production, Clerk should be properly configured
    console.warn('Clerk auth initialization failed, allowing request to proceed:', error.message)
    userId = null
  }
  
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