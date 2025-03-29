import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const token = await getToken({ req })

  // اگر مسیر /admin هست
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', req.url))
    }
  }

  return NextResponse.next()
}

// مشخص کردن مسیرهایی که باید بررسی شوند
export const config = {
  matcher: ['/admin/:path*'], // محافظت از تمام مسیرهای `/admin`
}
