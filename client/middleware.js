import { NextResponse } from 'next/server';

export function middleware(request) {
  // Just pass through all requests - let client-side handle authentication
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|public|uploads).*)'],
};
