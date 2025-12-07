import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/interview(.*)',
  '/workspace(.*)',
  '/dashboard(.*)',
  '/course(.*)',
  '/recruiter(.*)',
  '/api/(.*)',
])

// Clerk keys
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_ZXF1aXBwZWQtbGVtbWluZy02My5jbGVyay5hY2NvdW50cy5kZXYk'
const secretKey = process.env.CLERK_SECRET_KEY

export default function middleware(req) {
  // If no secret key, allow all routes (client-side Clerk will handle auth)
  if (!secretKey) {
    return NextResponse.next()
  }
  
  // Secret key available - use Clerk middleware
  return clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  }, { publishableKey, secretKey })(req)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
