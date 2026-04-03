// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow ALL these routes through without any checks
  const openRoutes = [
    '/',
    '/login',
    '/signup',
    '/onboarding',
    '/about',
    '/contact',
    '/features',
    '/pricing',
    '/forgot-password',
    '/reset-password',
    '/google/success',
  ];

  const isOpen = openRoutes.some(route => pathname.startsWith(route));
  if (isOpen) return NextResponse.next();

  // ✅ For dashboard routes, check cookie token
  // (localStorage tokens are handled by the dashboard layout client-side)
  const token = request.cookies.get('token')?.value;
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard && !token) {
    // Don't hard redirect — let client-side auth handle it
    // This prevents middleware from blocking localStorage-based auth
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};