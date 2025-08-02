import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an admin route
  if (pathname.startsWith('/admin')) {
    // For now, we'll let the client-side protection handle this
    // In a production app, you'd want to validate the user's session here
    // and check their admin status from a secure source

    // You could implement JWT validation here or check a secure cookie
    // For this demo, we rely on client-side protection
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
