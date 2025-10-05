import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle data files in production
  if (request.nextUrl.pathname.startsWith('/data/')) {
    return NextResponse.rewrite(new URL('/api/data' + request.nextUrl.pathname, request.url))
  }
}

export const config = {
  matcher: '/data/:path*'
}
