import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/workspace/profile(.*)',
  '/interview(.*)',
  '/'
])

// Clerk keys - publishableKey is public and safe to include
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_ZXF1aXBwZWQtbGVtbWluZy02My5jbGVyay5hY2NvdW50cy5kZXYk'
const secretKey = process.env.CLERK_SECRET_KEY

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
}, { publishableKey, secretKey })

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
