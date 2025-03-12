import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  console.log('🔍 مسیر درخواست:', req.nextUrl.pathname)
  console.log('🛡️ توکن کاربر:', token)
  // اگر توکن وجود نداشت، یعنی کاربر لاگین نیست
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // مسیرهای "admin/*" فقط برای ادمین‌ها باز باشه
  if (req.nextUrl.pathname.startsWith('/admin') && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*', // فقط مسیرهای "/admin/*" بررسی بشن
}
