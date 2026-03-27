// middleware.ts (in root of your Next.js app)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // ✅ Public routes (no auth required)
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/google/success'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // ✅ Landing page routes (no auth required)
  const landingRoutes = ['/', '/about', '/contact', '/features', '/pricing'];
  const isLandingRoute = landingRoutes.some(route => pathname === route);

  // ✅ Dashboard routes (auth required)
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // If trying to access dashboard without token, redirect to login
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access landing or auth pages with token, redirect to dashboard
  if ((isLandingRoute || isPublicRoute) && token && pathname !== '/google/success') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};